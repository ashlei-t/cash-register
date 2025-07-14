class CartsController < ApplicationController
  attr_reader :applied_rules

  def create
    cart = Cart.create
    render json: cart, status: :created
  end

  def show
    cart = Cart.find(params[:id])
    cart_items = cart.cart_items.includes(:item)

    result = cart_items.map do |ci|
      {
        code: ci.item.code,
        name: ci.item.name,
        quantity: ci.quantity,
        price: ci.item.price
      }
    end

    price_calc = CartPriceCalculator.new(cart)
    total = price_calc.total

    render json: {
      cart_id: cart.id,
      items: result,
      total: total,
      applied_rules: price_calc.applied_rules
    }
  end

  def checkout
    cart = Cart.find(params[:id])
    cart_items = cart.cart_items.includes(:item)

    result = cart_items.map do |ci|
      {
        code: ci.item.code,
        name: ci.item.name,
        quantity: ci.quantity,
        price: ci.item.price
      }
    end

    render json: {
      cart_id: cart.id,
      items: result,
      total: CartPriceCalculator.new(cart).total,
      message: "Checkout successful"
    }
  end

  def clear
    cart = Cart.find(params[:id])
    cart.cart_items.destroy_all

    render json: { message: "Cart has been cleared" }, status: :ok
  end
end
