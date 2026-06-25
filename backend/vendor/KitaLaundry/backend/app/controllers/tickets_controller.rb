class TicketsController < ApplicationController
  before_action :authorize_request
  before_action :set_ticket, only: [:show, :update, :destroy]

  def index
    if current_user.admin? || current_user.support_agent? || current_user.center_admin?
      @tickets = Ticket.all
    else
      @tickets = current_user.tickets
    end
    render json: @tickets, include: [:user, :assigned_to]
  end

  def show
    render json: @ticket, include: [:user, :assigned_to]
  end

  def create
    @ticket = current_user.tickets.build(ticket_params)
    if @ticket.save
      render json: @ticket, status: :created
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  def update
    # Only support agents/admins can change status or assignment
    if current_user.customer? && ticket_params.keys.any? { |k| ['status', 'assigned_to_id'].include?(k) }
      return render json: { error: 'Customers cannot update status or assignment' }, status: :forbidden
    end

    if @ticket.update(ticket_params)
      render json: @ticket
    else
      render json: @ticket.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @ticket.destroy
    head :no_content
  end

  private

  def set_ticket
    @ticket = Ticket.find(params[:id])
    if current_user.customer? && @ticket.user_id != current_user.id
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end

  def ticket_params
    if current_user.customer?
      params.require(:ticket).permit(:subject, :description)
    else
      params.require(:ticket).permit(:subject, :description, :status, :assigned_to_id)
    end
  end
end
