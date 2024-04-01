# Node.js

Proof of concept - NETOPIA integration in Node.js

## Card Payment Module in nodejs

This module made to use as an example of implementation for online payment via Card

## Where to send the Request

- Live : https://secure.mobilpay.ro
- Sandbox : https://sandboxsecure.mobilpay.ro
  (only HTTP POST requests accepted)

## Payment Request Structure

In order to send the payment request to NETOPIA Payments , you need to encrypt the payment data on **POST** method and encapsulate the information using the following structure.

```javascript
const data = {
  order: {
    $: {
      id: orderId,
      timestamp: date.getTime(),
      type: "card",
    },
    signature: "<your_netopia_seller_account_signature>",
    url: {
      return: "<your_return_URL>",
      confirm: "<your_confirm_URL>",
    },
    invoice: {
      $: {
        currency: currency,
        amount: amount,
      },
      details: "test plata",
      contact_info: {
        billing: {
          $: {
            type: "person",
          },
          first_name: "Test",
          last_name: "Test",
          address: "strada",
          email: "test@mobilpay.ro",
          mobile_phone: "mobilePhone",
        },
        shipping: {
          $: {
            type: "person",
          },
          first_name: "Test",
          last_name: "Test",
          address: "strada",
          email: "test@mobilpay.ro",
          mobile_phone: "mobilePhone",
        },
      },
    },
    ipn_cipher: "aes-256-cbc",
  },
};
```

- ### Requiered fields

  All the fields are requiered, except `shipping`.

- ### Confirm URL
  The confirm URL will be used for IPN (Instant Payment Notification) - i.e. to send information about the transaction's status.
- ### Redirect URL
  The redirect URL will be used to redirect User/Customer back to the Merchant's website from NETOPIA Payments (from the payment page, after the payment is done)
