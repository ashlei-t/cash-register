require 'rails_helper'

RSpec.describe CartPriceCalculator do
  let(:cart) { Cart.create }

  def add_to_cart(code, quantity)
    item = create_product(code)
    cart.cart_items.create(item: item, quantity: quantity)
  end

  describe "#total" do
    context "Buy One Get One Free" do
      it "applies the rule when qty is 2, expected price = 3.11" do
        add_to_cart("GR1", 2)

        total = CartPriceCalculator.new(cart).total

        expect(total).to eq(3.11)
      end

      it "does not apply the rule when qty is 1, expected price = 3.11" do
        add_to_cart("GR1", 1)

        total = CartPriceCalculator.new(cart).total

        expect(total).to eq(3.11)
      end

      it "applies the rule when qty is 5, expected price = 9.33" do
        add_to_cart("GR1", 5)

        total = CartPriceCalculator.new(cart).total

        expect(total).to eq(9.33)
      end
    end

    context "Bulk Discount" do
      it "does not apply the rule when qty is 2, expected price 10.00" do
        add_to_cart("SR1", 2)

        total = CartPriceCalculator.new(cart).total

        expect(total).to eq(10.00)
      end
      it "applies the rule when qty is 3, expected price 16.61 (mixed with BOGO rule)" do
        add_to_cart("GR1", 2)
        add_to_cart("SR1", 3)

        total = CartPriceCalculator.new(cart).total

        expect(total).to eq(16.61)
      end
      it "applies the rule when qty is 5, expected price 22.50" do
        add_to_cart("SR1", 5)

        total = CartPriceCalculator.new(cart).total

        expect(total).to eq(22.50)
      end
    end

    context "Buy More Save More" do
      it "applies the rule when qty is 3, expected price 30.57" do
        add_to_cart("GR1", 1)
        add_to_cart("SR1", 1)
        add_to_cart("CF1", 3)

        total = CartPriceCalculator.new(cart).total

        expect(total).to eq(30.57)
      end

      it "does not apply the rule when qty is 2, expected price 22.46" do
        add_to_cart("CF1", 2)

        total = CartPriceCalculator.new(cart).total

        expect(total).to eq(22.46)
      end
    end

    context "Edge cases" do
      it "applies no pricing rules and returns 19.34" do
        add_to_cart("GR1", 1)
        add_to_cart("SR1", 1)
        add_to_cart("CF1", 1)

        total = CartPriceCalculator.new(cart).total

        expect(total).to eq(19.34)
      end

      it "returns 0.0 when no items are added" do
        total = CartPriceCalculator.new(cart).total

        expect(total).to eq(0.0)
      end
    end
  end
end
