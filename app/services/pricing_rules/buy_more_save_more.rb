module PricingRules
  class BuyMoreSaveMore
      def initialize(code, threshold, discount_ratio)
        @code = code
        @threshold = threshold
        @discount_ratio = discount_ratio
      end

      def applies_to?(cart_item)
          cart_item.item.code == @code
      end

      def calculate(cart_item)
          quantity = cart_item.quantity.to_i
          price = cart_item.item.price

          if quantity >= @threshold
            subtotal = quantity * (price * @discount_ratio)
            [ subtotal, "Buy More Save More applied, promo price €#{(@discount_ratio * price).round(2)}" ]
          else
            [ quantity * price, nil ]
          end
      end
  end
end
