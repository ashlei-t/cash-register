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

        if quantity >= 2
          effective_qty = (quantity/2) + (quantity % 2)
          subtotal = effective_qty * price
          [ subtotal, "Buy 1, Get 1 Free applied" ]
        else
          [ quantity * price, nil ]
        end
    end
end
