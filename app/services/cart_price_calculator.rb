require_relative "./pricing_rules/bulk_discount"
require_relative "./pricing_rules/buy_more_save_more"
require_relative "./pricing_rules/buy_one_get_one_free"

class CartPriceCalculator
  attr_reader :items, :total

  def initialize(cart)
    @cart = cart
    @rules = [
      # BuyOneGetOneFree expects: code
      PricingRules::BuyOneGetOneFree.new("GR1"),
      # BulkDiscount expects: code, threshold, new_price
      PricingRules::BulkDiscount.new("SR1", 3, 4.50),
      # BuyMoreSaveMore expects: code, threshold, discount_ratio
      PricingRules::BuyMoreSaveMore.new("CF1", 3, 2.0/3)
    ]
    @items = []
    @total = 0
    calculate!
  end

  def calculate!
    cart_items = @cart.cart_items.includes(:item)

    cart_items.each do |cart_item|
      quantity = cart_item.quantity.to_i
      price = cart_item.item.price.to_i
      code = cart_item.item.code
      rule = @rules.find { |r| r.applies_to?(cart_item) }

      puts "DEBUG: #{code} x #{quantity} at #{price} each, #{rule}"

      if rule
        subtotal, description = rule.calculate(cart_item)
      else
        subtotal = quantity * price
        description = nil
      end

      @total += subtotal

      @items << {
        code: cart_item.item.code,
        name: cart_item.item.name,
        quantity: quantity,
        original_price: price,
        subtotal: subtotal.round(2),
        discount_applied: description
      }
    end

    @total = @total.round(2)
  end
end
