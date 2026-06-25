class OrderChannel < ApplicationCable::Channel
  def subscribed
    # Customers subscribe to their own updates. Admins/Branch Managers can subscribe to all or specific branch channels if needed.
    if current_user.customer?
      stream_from "orders_user_#{current_user.id}"
    else
      # Listen to all orders for simple admin case, or a specific branch
      stream_from "orders_admin_#{current_user.branch_id || 'all'}"
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
