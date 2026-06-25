module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      header = request.params[:token] || request.headers['Authorization']
      header = header.split(' ').last if header
      
      if header
        decoded = JsonWebToken.decode(header)
        if decoded && user = User.find_by(id: decoded[:user_id])
          return user
        end
      end
      reject_unauthorized_connection
    end
  end
end
