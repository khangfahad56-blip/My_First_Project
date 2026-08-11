let apple_price = 200;
      let banana_price = 50;
      let mango_price = 300;
      let grape_price = 300;

      function total_cost (item1, item2, item3, item4) {

        let total = item1 * apple_price +
          item2 * banana_price +
          item3 * mango_price +
          item4 * grape_price

        console.log(total);

        return total;
      }