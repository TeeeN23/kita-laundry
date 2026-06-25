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
end
