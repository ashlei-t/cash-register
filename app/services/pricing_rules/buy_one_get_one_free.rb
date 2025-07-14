class BuyOneGetOneFree
    def initialize(code)
      @code = code
    end

    def applies_to?(cart_item)
        cart_item.item.code == @code
    end

    def calculate(cart_item)
        quantity = cart_item.quantity.to_i
        price = cart_item.item.price

        # unlimited uses of the rule
        total = (quantity / 2.0).ceil * price

        # this limits the rule to one-time use
        # total = if quantity >= 2
        #   (quantity - 1) * price
        # else
        #     quantity * price
        # end

        # return the total
        total
    end
    def description(cart_item)
      "Buy One Get One Free applied to #{cart_item.item.name}"
    end
end
