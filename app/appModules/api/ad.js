class Ad {
  constructor(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
  }
  homeList() {
    const me = this;
    me.res.send({status:'success', data:{
      "promotion": [
          {
            "image" : "menu_image1.png",
            "ipfs" : "QmNzCw8ydzaZ48kCm9HQSjqrhppuRtSMzFYT1e3f3fciTe",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image2.png",
            "ipfs" : "QmPAaxDrgwpKcydQZ44SxFLDq3RZASaB2xgxSAw8ov4bKA",
            "name" : "Beef over Curry-Spiced Rice",
            "rating": 3.5
          },
          {
            "image" : "menu_image3.png",
            "ipfs" : "QmczZKahoqqkQVGraBsb6TNC6CwnpiJFj7wkcmf1aJzzNa",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image1.png",
            "ipfs" : "QmNzCw8ydzaZ48kCm9HQSjqrhppuRtSMzFYT1e3f3fciTe",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image2.png",
            "ipfs" : "QmPAaxDrgwpKcydQZ44SxFLDq3RZASaB2xgxSAw8ov4bKA",
            "name" : "Beef over Curry-Spiced Rice",
            "rating": 3.5
          },
          {
            "image" : "menu_image3.png",
            "ipfs" : "QmczZKahoqqkQVGraBsb6TNC6CwnpiJFj7wkcmf1aJzzNa",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image1.png",
            "ipfs" : "QmNzCw8ydzaZ48kCm9HQSjqrhppuRtSMzFYT1e3f3fciTe",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image2.png",
            "ipfs" : "QmPAaxDrgwpKcydQZ44SxFLDq3RZASaB2xgxSAw8ov4bKA",
            "name" : "Beef over Curry-Spiced Rice",
            "rating": 3.5
          },
          {
            "image" : "menu_image3.png",
            "ipfs" : "QmczZKahoqqkQVGraBsb6TNC6CwnpiJFj7wkcmf1aJzzNa",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image1.png",
            "ipfs" : "QmNzCw8ydzaZ48kCm9HQSjqrhppuRtSMzFYT1e3f3fciTe",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image2.png",
            "ipfs" : "QmPAaxDrgwpKcydQZ44SxFLDq3RZASaB2xgxSAw8ov4bKA",
            "name" : "Beef over Curry-Spiced Rice",
            "rating": 3.5
          },
          {
            "image" : "menu_image3.png",
            "ipfs" : "QmczZKahoqqkQVGraBsb6TNC6CwnpiJFj7wkcmf1aJzzNa",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image1.png",
            "ipfs" : "QmNzCw8ydzaZ48kCm9HQSjqrhppuRtSMzFYT1e3f3fciTe",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image2.png",
            "ipfs" : "QmPAaxDrgwpKcydQZ44SxFLDq3RZASaB2xgxSAw8ov4bKA",
            "name" : "Beef over Curry-Spiced Rice",
            "rating": 3.5
          },
          {
            "image" : "menu_image3.png",
            "ipfs" : "QmczZKahoqqkQVGraBsb6TNC6CwnpiJFj7wkcmf1aJzzNa",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image1.png",
            "ipfs" : "QmNzCw8ydzaZ48kCm9HQSjqrhppuRtSMzFYT1e3f3fciTe",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image2.png",
            "ipfs" : "QmPAaxDrgwpKcydQZ44SxFLDq3RZASaB2xgxSAw8ov4bKA",
            "name" : "Beef over Curry-Spiced Rice",
            "rating": 3.5
          },
          {
            "image" : "menu_image3.png",
            "ipfs" : "QmczZKahoqqkQVGraBsb6TNC6CwnpiJFj7wkcmf1aJzzNa",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image1.png",
            "ipfs" : "QmNzCw8ydzaZ48kCm9HQSjqrhppuRtSMzFYT1e3f3fciTe",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image2.png",
            "ipfs" : "QmPAaxDrgwpKcydQZ44SxFLDq3RZASaB2xgxSAw8ov4bKA",
            "name" : "Beef over Curry-Spiced Rice",
            "rating": 3.5
          },
          {
            "image" : "menu_image3.png",
            "ipfs" : "QmczZKahoqqkQVGraBsb6TNC6CwnpiJFj7wkcmf1aJzzNa",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image1.png",
            "ipfs" : "QmNzCw8ydzaZ48kCm9HQSjqrhppuRtSMzFYT1e3f3fciTe",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image2.png",
            "ipfs" : "QmPAaxDrgwpKcydQZ44SxFLDq3RZASaB2xgxSAw8ov4bKA",
            "name" : "Beef over Curry-Spiced Rice",
            "rating": 3.5
          },
          {
            "image" : "menu_image3.png",
            "ipfs" : "QmczZKahoqqkQVGraBsb6TNC6CwnpiJFj7wkcmf1aJzzNa",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },      {
            "image" : "menu_image1.png",
            "ipfs" : "QmNzCw8ydzaZ48kCm9HQSjqrhppuRtSMzFYT1e3f3fciTe",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          },
          {
            "image" : "menu_image2.png",
            "ipfs" : "QmPAaxDrgwpKcydQZ44SxFLDq3RZASaB2xgxSAw8ov4bKA",
            "name" : "Beef over Curry-Spiced Rice",
            "rating": 3.5
          },
          {
            "image" : "menu_image3.png",
            "ipfs" : "QmczZKahoqqkQVGraBsb6TNC6CwnpiJFj7wkcmf1aJzzNa",
            "name" :"Sichuan Crispy Chicken",
            "rating": 5
          }
        ],
      "topStory": {
        "title": "title",
        "content": "content",
        "photos": [
          {
            "image" : "menu_image1.png",
            "ipfs" : "QmNzCw8ydzaZ48kCm9HQSjqrhppuRtSMzFYT1e3f3fciTe"
          },
          {
            "image" : "menu_image2.png",
            "ipfs" : "QmPAaxDrgwpKcydQZ44SxFLDq3RZASaB2xgxSAw8ov4bKA"
          },
          {
            "image" : "menu_image3.png",
            "ipfs" : "QmczZKahoqqkQVGraBsb6TNC6CwnpiJFj7wkcmf1aJzzNa"
          }
        ]
      }
    }});
  }
  actionError() {
    const me = this;
    me.res.send({status: 'failure',  message: 'Action Error!'});
  }
}
module.exports  = Ad;
