require_relative "./pricing_rules/bulk_discount"
require_relative "./pricing_rules/buy_more_save_more"
require_relative "./pricing_rules/buy_one_get_one_free"

class CartPriceCalculator
  def initialize(cart)
    @cart = cart
    @rules = [
      # BuyOneGetOneFree expects: code
      BuyOneGetOneFree.new("GR1"),
      # BulkDiscount expects: code, threshold, new_price
      BulkDiscount.new("SR1", 3, 4.50),
      # BuyMoreSaveMore expects: code, threshold, discount_ratio
      BuyMoreSaveMore.new("CF1", 3, 2.0/3)
    ]
  end

  def total
    total = 0

    cart_items = @cart.cart_items.includes(:item)

    cart_items.each do |cart_item|
      rule = @rules.find { |r| r.applies_to?(cart_item) }

      quantity = cart_item.quantity.to_i
      code = cart_item.item.code
      price = cart_item.item.price

      puts "DEBUG: #{code} x #{quantity} at #{price} each"

      item_total = if rule
        rule.calculate(cart_item)
      else
        cart_item.quantity.to_i * cart_item.item.price
      end

      total += item_total
    end

    total.round(2)
  end
end
