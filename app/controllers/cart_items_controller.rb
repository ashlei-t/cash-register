class CartItemsController < ApplicationController
  def create
    cart = Cart.find(params[:cart_id])
    item = Item.find_by(code: params[:code])

    if item.nil?
      render json: { error: "Item not found" }, status: :not_found
      return
    end

    cart_item = cart.cart_items.create(item: item, quantity: params[:quantity])
    render json: cart_item, status: :created
  end

  def update
    cart = Cart.find(params[:cart_id])
    item = Item.find_by(code: params[:code])

    cart_item = cart.cart_items.find_by(item_id: item.id)

    if cart_item.nil?
      render json: { error: "Item not found in cart" }, status: :not_found
      return
    end

    if params[:quantity].to_i == 0
      cart_item.destroy
      render json: { message: "Item removed from cart" }, status: :ok
    else
      cart_item.update(quantity: params[:quantity])
      render json: cart_item, status: :ok
    end
  end

  def destroy
    cart = Cart.find(params[:cart_id])
    item = Item.find_by(code: params[:code])

    cart_item = cart.cart_items.find_by(item_id: item.id)

    if cart_item
      cart_item.destroy
      render json: { message: "Item removed from cart" }, status: :ok
    else
      render json: { error: "Item not found in cart" }, status: :not_found
    end
  end
end
