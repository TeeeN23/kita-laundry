class UserMailer < ApplicationMailer
  def verification_email
    @user = params[:user]
    @verification_url = "http://localhost:3000/auth/verify-email?token=#{@user.verification_token}"
    mail(to: @user.email, subject: 'Welcome to KitaLaundry! Please verify your email')
  end
end
