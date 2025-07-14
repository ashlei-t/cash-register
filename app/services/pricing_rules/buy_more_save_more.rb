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

        total = if quantity >= @threshold
          quantity * (price * @discount_ratio)
        else
          quantity * price
        end
        total
    end
end
