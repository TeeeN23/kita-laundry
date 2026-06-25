class WebhooksController < ApplicationController
  def xendit
    # Verify the incoming webhook token
    expected_token = ENV['XENDIT_WEBHOOK_VERIFICATION_TOKEN']
    actual_token = request.headers['x-callback-token']

    if expected_token.present? && actual_token != expected_token
      render json: { success: false, message: 'Invalid callback token' }, status: :unauthorized
      return
    end

    payload = params.permit!.to_h

    # Find the order by xendit_invoice_id
    order = Order.find_by(xendit_invoice_id: payload['id'])

    if order
      if payload['status'] == 'PAID'
        order.update(payment_status: :paid)
        # We can also notify the user here via WebSocket or WhatsApp later
      elsif payload['status'] == 'EXPIRED'
        order.update(payment_status: :expired, status: :cancelled)
      end
      render json: { success: true }, status: :ok
    else
      render json: { success: false, message: 'Order not found' }, status: :not_found
    end
  rescue => e
    render json: { success: false, error: e.message }, status: :internal_server_error
  end
end
