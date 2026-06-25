class Admin::ServicesController < ApplicationController
  before_action :authorize_request

  def index
    branch_id = current_user.role == 'branch_manager' ? get_branch_id : Branch.first&.id
    services = branch_id ? Service.where(branch_id: branch_id) : Service.all
    formatted_services = services.map { |s| format_service(s) }
    render json: { success: true, data: { services: formatted_services } }, status: :ok
  end

  def create
    branch = Branch.first
    service = Service.new(
      name: params[:displayName] || params[:name],
      description: params[:description],
      category: params[:category],
      is_express_available: params[:isExpressAvailable],
      turnaround_standard: params[:turnaroundTime]&.[](:standard) || 48,
      turnaround_express: params[:turnaroundTime]&.[](:express) || 24,
      branch: branch,
      price_per_kg: 7000
    )

    if service.save
      render json: { success: true, data: { service: format_service(service) } }, status: :created
    else
      render json: { success: false, errors: service.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def toggle
    service = Service.find(params[:id])
    service.update(is_active: !service.is_active)
    render json: { success: true, message: "Service #{service.is_active ? 'activated' : 'deactivated'} successfully", data: { service: format_service(service) } }, status: :ok
  end

  def destroy
    service = Service.find(params[:id])
    service.destroy
    render json: { success: true, message: "Service deleted successfully" }, status: :ok
  end

  private

  def format_service(service)
    {
      _id: service.id.to_s,
      name: service.name,
      code: service.id.to_s,
      displayName: service.name,
      description: service.description || '',
      category: service.category || 'laundry',
      icon: 'laundry',
      turnaroundTime: { 
        standard: service.turnaround_standard || 48, 
        express: service.turnaround_express || 24 
      },
      isExpressAvailable: service.is_express_available.nil? ? true : service.is_express_available,
      isActiveForBranch: service.is_active.nil? ? true : service.is_active,
      priceMultiplier: 1.0,
      source: 'admin',
      canDelete: true
    }
  end
end
