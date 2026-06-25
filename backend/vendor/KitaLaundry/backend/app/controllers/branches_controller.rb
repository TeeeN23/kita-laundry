class BranchesController < ApplicationController
  # We make index public for the frontend new order flow
  before_action :authorize_request, except: [:index]
  before_action :require_admin, except: [:index, :show]
  before_action :set_branch, only: [:show, :update, :destroy]

  def index
    @branches = Branch.all
    formatted_branches = @branches.map do |b|
      {
        _id: b.id.to_s,
        name: b.name,
        code: b.id.to_s,
        address: { addressLine1: b.address, city: "", pincode: "" },
        phone: b.phone
      }
    end

    render json: { success: true, data: { branches: formatted_branches } }
  end

  def show
    render json: @branch
  end

  def create
    @branch = Branch.new(branch_params)
    if @branch.save
      render json: @branch, status: :created
    else
      render json: @branch.errors, status: :unprocessable_entity
    end
  end

  def update
    if @branch.update(branch_params)
      render json: @branch
    else
      render json: @branch.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @branch.destroy
    head :no_content
  end

  private

  def set_branch
    @branch = Branch.find(params[:id])
  end

  def branch_params
    params.require(:branch).permit(:name, :address, :phone, :status)
  end
end
