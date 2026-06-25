require 'net/http'
require 'json'

class WhatsappService
  API_VERSION = 'v19.0'

  def initialize
    @phone_number_id = ENV['WHATSAPP_PHONE_NUMBER_ID']
    @access_token = ENV['WHATSAPP_ACCESS_TOKEN']
  end

  def send_template_message(to_phone, template_name, language_code = 'id')
    return false unless valid_credentials?

    uri = URI("https://graph.facebook.com/#{API_VERSION}/#{@phone_number_id}/messages")
    req = Net::HTTP::Post.new(uri)
    req['Authorization'] = "Bearer #{@access_token}"
    req['Content-Type'] = 'application/json'

    # Format phone number to international format (e.g., replace leading 0 with 62 for Indonesia)
    formatted_phone = format_phone(to_phone)

    req.body = {
      messaging_product: 'whatsapp',
      to: formatted_phone,
      type: 'template',
      template: {
        name: template_name,
        language: {
          code: language_code
        }
      }
    }.to_json

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end

    if response.is_a?(Net::HTTPSuccess)
      Rails.logger.info("WhatsApp notification sent to #{formatted_phone}")
      true
    else
      Rails.logger.error("Failed to send WhatsApp notification: #{response.body}")
      false
    end
  rescue StandardError => e
    Rails.logger.error("WhatsApp Service Error: #{e.message}")
    false
  end

  private

  def valid_credentials?
    @phone_number_id.present? && @access_token.present?
  end

  def format_phone(phone)
    # Remove all non-numeric characters
    cleaned = phone.to_s.gsub(/\D/, '')
    # If starts with 0, replace with 62 (Indonesia country code)
    cleaned.start_with?('0') ? "62#{cleaned[1..-1]}" : cleaned
  end
end
