module ItemHelpers
  def create_product(code)
    catalog = {
      "GR1" => { name: "Green Tea", price: 3.11 },
      "SR1" => { name: "Strawberry", price: 5.00 },
      "CF1" => { name: "Coffee", price: 11.23 }
    }

    details = catalog[code]
    raise "Unknown product code: #{code}" unless details

    Item.create(code: code, name: details[:name], price: details[:price])
  end
end
