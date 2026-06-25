class UsersController < ApplicationController
  def create
    unless verify_recaptcha?(params[:recaptcha_token])
      return render json: { success: false, errors: ['Validasi reCAPTCHA gagal. Silakan coba lagi.'] }, status: :unprocessable_entity
    end

    if User.exists?(email: params[:email])
      render json: { success: false, errors: ['Akun dengan email tersebut sudah terdaftar. Silakan login.'] }, status: :unprocessable_entity
      return
    end

    @user = User.new(user_params)
    @user.role = :customer # default role for public registration

    if @user.save
      UserMailer.with(user: @user).verification_email.deliver_later
      render json: { success: true, message: 'Verification email sent' }, status: :created
    else
      render json: { success: false, errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    # Frontend sends 'name', backend expects 'first_name' and 'last_name'
    if params[:name].present?
      names = params[:name].split(' ', 2)
      params[:first_name] = names[0]
      params[:last_name] = names[1] || ''
    end
    params.permit(:email, :password, :password_confirmation, :first_name, :last_name, :phone)
  end
end
