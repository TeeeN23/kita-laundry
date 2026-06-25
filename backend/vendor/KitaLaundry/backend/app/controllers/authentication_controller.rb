class AuthenticationController < ApplicationController
  def login
    @user = User.find_by(email: params[:email])
    
    if @user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: @user.id, role: @user.role)
      time = Time.now + 24.hours.to_i
      render json: {
        token: token,
        exp: time.strftime("%m-%d-%Y %H:%M"),
        user: {
          id: @user.id,
          email: @user.email,
          role: @user.role,
          first_name: @user.first_name,
          last_name: @user.last_name
        }
      }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end
end
