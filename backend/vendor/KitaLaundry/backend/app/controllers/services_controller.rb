class ServicesController < ApplicationController
  before_action :authorize_request, except: [:index]
  before_action :require_admin, except: [:index, :show]
  before_action :set_service, only: [:show, :update, :destroy]

  def index
    if params[:branch_id].present?
      @services = Service.where(branch_id: params[:branch_id])
    else
      @services = Service.all
    end
    
    formatted_services = @services.map do |s|
      {
        _id: s.id.to_s,
        name: s.name,
        code: s.id.to_s,
        displayName: s.name,
        description: s.description,
        icon: "shirt",
        category: "normal",
        turnaroundTime: { standard: 48, express: 24 },
        isExpressAvailable: true,
        priceMultiplier: 1.5,
        basePrice: s.price_per_kg
      }
    end

    render json: { success: true, data: { services: formatted_services } }
  end

  def show
    render json: @service
  end

  def create
    @service = Service.new(service_params)
    if @service.save
      render json: @service, status: :created
    else
      render json: @service.errors, status: :unprocessable_entity
    end
  end

  def update
    if @service.update(service_params)
      render json: @service
    else
      render json: @service.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @service.destroy
    head :no_content
  end

  private

  def set_service
    @service = Service.find(params[:id])
  end

  def service_params
    params.require(:service).permit(:name, :price_per_kg, :description, :branch_id)
  end
end
