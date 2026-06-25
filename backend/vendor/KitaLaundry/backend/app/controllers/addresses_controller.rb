class AddressesController < ApplicationController
  before_action :authorize_request
  before_action :set_address, only: [:show, :update, :destroy]

  def index
    # Customers only see their own addresses
    if current_user.admin? || current_user.center_admin?
      @addresses = Address.all
    else
      @addresses = current_user.addresses
    end
    render json: @addresses
  end

  def show
    render json: @address
  end

  def create
    @address = current_user.addresses.build(address_params)
    
    # If this is the first address, make it primary automatically
    @address.is_primary = true if current_user.addresses.count == 0

    if @address.save
      render json: @address, status: :created
    else
      render json: @address.errors, status: :unprocessable_entity
    end
  end

  def update
    if @address.update(address_params)
      render json: @address
    else
      render json: @address.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @address.destroy
    head :no_content
  end

  private

  def set_address
    @address = Address.find(params[:id])
    
    # Ensure customers can only access their own address
    unless current_user.admin? || current_user.center_admin?
      if @address.user_id != current_user.id
        render json: { error: 'Forbidden' }, status: :forbidden
      end
    end
  end

  def address_params
    params.require(:address).permit(:street, :city, :postal_code, :is_primary)
  end
end
