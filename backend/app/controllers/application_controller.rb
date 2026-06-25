class ApplicationController < ActionController::API
  def authorize_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    
    begin
      @decoded = JsonWebToken.decode(header)
      if @decoded
        @current_user = User.find(@decoded[:user_id])
      else
        render json: { errors: 'Unauthorized' }, status: :unauthorized
      end
    rescue ActiveRecord::RecordNotFound => e
      render json: { errors: 'Unauthorized' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end

  def require_admin
    unless current_user&.admin? || current_user&.center_admin?
      render json: { errors: 'Forbidden' }, status: :forbidden
    end
  end

  def get_branch_id
    puts "DEBUG: current_user is #{current_user.email}, branch_id=#{current_user.branch_id}"
    current_user.branch_id || Branch.first&.id
  end

  protected

  def verify_recaptcha?(token)
    return false if token.blank?
    
    secret_key = ENV['RECAPTCHA_SECRET_KEY']
    uri = URI.parse('https://www.google.com/recaptcha/api/siteverify')
    response = Net::HTTP.post_form(uri, secret: secret_key, response: token)
    result = JSON.parse(response.body)
    
    result['success']
  rescue StandardError => e
    Rails.logger.error("reCAPTCHA validation failed: #{e.message}")
    false
  end
end
