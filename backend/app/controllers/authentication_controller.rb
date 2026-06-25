class AuthenticationController < ApplicationController
  def login
    unless verify_recaptcha?(params[:recaptcha_token])
      return render json: { success: false, message: 'Validasi reCAPTCHA gagal. Silakan coba lagi.' }, status: :unauthorized
    end

    @user = User.find_by(email: params[:email])
    
    if @user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: @user.id, role: @user.role)
      time = Time.now + 24.hours.to_i
      render json: {
        success: true,
        data: {
          token: token,
          exp: time.strftime("%m-%d-%Y %H:%M"),
          user: {
            _id: @user.id.to_s,
            id: @user.id.to_s,
            name: "#{@user.first_name} #{@user.last_name}".strip,
            email: @user.email,
            phone: @user.phone || '',
            role: @user.role,
            isActive: true
          }
        }
      }, status: :ok
    else
      render json: { success: false, message: 'Email atau kata sandi tidak valid. Silakan coba lagi.' }, status: :unauthorized
    end
  end

  def oauth
    provider = params[:provider]
    token = params[:token]
    
    if provider == 'google'
      # Verify via Google API using access_token
      uri = URI.parse("https://www.googleapis.com/oauth2/v3/userinfo")
      request = Net::HTTP::Get.new(uri)
      request["Authorization"] = "Bearer #{token}"
      response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
        http.request(request)
      end
      
      if response.is_a?(Net::HTTPSuccess)
        user_info = JSON.parse(response.body)
        email = user_info['email']
        name = user_info['name']
        uid = user_info['sub']
      else
        return render json: { success: false, message: 'Invalid Google Token' }, status: :unauthorized
      end
    elsif provider == 'facebook'
      # Verify via Facebook Graph API
      uri = URI.parse("https://graph.facebook.com/me?fields=id,name,email&access_token=#{token}")
      response = Net::HTTP.get_response(uri)
      if response.is_a?(Net::HTTPSuccess)
        user_info = JSON.parse(response.body)
        email = user_info['email']
        name = user_info['name']
        uid = user_info['id']
      else
        return render json: { success: false, message: 'Invalid Facebook Token' }, status: :unauthorized
      end
    else
      return render json: { success: false, message: 'Unsupported provider' }, status: :bad_request
    end

    if email.blank?
      return render json: { success: false, message: 'Email tidak diberikan oleh penyedia layanan (provider)' }, status: :unprocessable_entity
    end

    # Find or create user
    @user = User.find_by(email: email)
    if @user
      # Update provider info if not set
      @user.update(provider: provider, uid: uid) if @user.provider.blank?
    else
      names = name.to_s.split(' ', 2)
      @user = User.new(
        email: email,
        first_name: names[0].presence || 'User',
        last_name: names[1] || '',
        provider: provider,
        uid: uid,
        role: :customer
      )
      @user.email_verified_at = Time.current # Social logins are pre-verified
      unless @user.save
        return render json: { success: false, errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # Generate JWT
    jwt_token = JsonWebToken.encode(user_id: @user.id, role: @user.role)
    time = Time.now + 24.hours.to_i
    render json: {
      success: true,
      data: {
        token: jwt_token,
        exp: time.strftime("%m-%d-%Y %H:%M"),
        user: {
          _id: @user.id.to_s,
          id: @user.id.to_s,
          name: "#{@user.first_name} #{@user.last_name}".strip,
          email: @user.email,
          phone: @user.phone || '',
          role: @user.role,
          isActive: true
        }
      }
    }, status: :ok
  end

  def profile
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    begin
      decoded = JsonWebToken.decode(header)
      @user = User.find(decoded[:user_id])
      render json: {
        success: true,
        data: {
          user: {
            _id: @user.id.to_s,
            id: @user.id.to_s,
            name: "#{@user.first_name} #{@user.last_name}".strip,
            email: @user.email,
            phone: @user.phone || '',
            role: @user.role,
            isActive: true
          }
        }
      }, status: :ok
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError
      render json: { errors: 'Unauthorized' }, status: :unauthorized
    end
  end
  def verify_email
    @user = User.find_by(verification_token: params[:token])

    if @user
      if @user.email_verified_at.present?
        render json: { success: false, message: 'Email already verified' }, status: :unprocessable_entity
      else
        @user.update(email_verified_at: Time.current, verification_token: nil)
        
        # Also return a token so the frontend can log them in immediately
        token = JsonWebToken.encode(user_id: @user.id, role: @user.role)
        time = Time.now + 24.hours.to_i
        
        render json: {
          success: true,
          data: {
            token: token,
            exp: time.strftime("%m-%d-%Y %H:%M"),
            user: {
              _id: @user.id.to_s,
              id: @user.id.to_s,
              name: "#{@user.first_name} #{@user.last_name}".strip,
              email: @user.email,
              phone: @user.phone || '',
              role: @user.role,
              isActive: true
            }
          }
        }, status: :ok
      end
    else
      render json: { success: false, message: 'Invalid verification token' }, status: :not_found
    end
  end

  def resend_verification
    @user = User.find_by(email: params[:email])
    
    if @user
      if @user.email_verified_at.present?
        render json: { success: false, message: 'Email already verified' }, status: :unprocessable_entity
      else
        @user.generate_verification_token
        @user.save
        UserMailer.with(user: @user).verification_email.deliver_later
        render json: { success: true, message: 'Verification email resent' }, status: :ok
      end
    else
      render json: { success: false, message: 'User not found' }, status: :not_found
    end
  end
end
