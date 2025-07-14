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
        price = cart_item.item.price

        total = if quantity >= @threshold
          quantity * @new_price
        else
          quantity * price
        end
        total
    end
    def description(cart_item)
      "Bulk Discount applied to #{cart_item.item.name}"
    end
end
