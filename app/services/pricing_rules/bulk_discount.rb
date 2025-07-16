module PricingRules
class BulkDiscount
      def initialize(code, threshold, new_price)
        @code = code
        @threshold = threshold
        @new_price = new_price
      end
      def applies_to?(cart_item)
          cart_item.item.code == @code
      end

      def calculate(cart_item)
          quantity = cart_item.quantity.to_i
          price = cart_item.item.price.to_i

          if quantity >= @threshold
            subtotal = quantity * @new_price
            [ subtotal, "Bulk discount applied, promo price €#{format('%.2f', @new_price)}" ]
          else
            [ quantity * price, nil ]
          end
      end
  end
end
