# Warren Service

This is the accompanying RESTful microservice for the Warren Personal Finance Web Platform. It was made in TypeScript using a MongoDB database and deployed using Docker.

It is a web service with multiple endpoints used to store user data, user transactions, user transaction categories, user wallets and fetch specific user balance data for use in the Warren Web Platform.

## Route Documentation

### **Log in User**:

> Logs in the user and returns its auth token used to validate all other requests besides login and registration.

**Endpoint:** `POST warren_service/login`

**Requires Auth:** No.

**Query:** None.

**Params:** None.

**Body:**

User id and password to log in:

``
{
  _id: string,
  password: string
}
``

**Success return:**

Authentication token generated by login:

``
{
  token: string
}
``

---

### **Register User**:

> Registers a new user, adding it to the database and allowing it to log in. Returns the registered user's id.

**Endpoint:** `POST warren_service/register`

**Requires Auth:** No.

**Query:** None.

**Params:** None.

**Body:**

User id and password to register:

``
{
  _id: string,
  password: string
}
``

**Success return:**

Registered user id:

``
{
  _id: string
}
``

---

### **Change User Password**:

> Updates a registered user's password and returns the modified user id.

**Endpoint:** `PUT warren_service/:_id/password`

**Requires Auth:** Yes.

**Query:** None.

**Params:** 

User id from which to get the data.

``
_id: string
``

**Body:** 

New password with which to update:

``
password: string
``

**Success return:**

User id that had its password changed:

``
_id: string
``

---

### **Delete User**:

> Deletes a registered user and returns nothing.

**Endpoint:** `DELETE warren_service/:_id`

**Requires Auth:** Yes.

**Query:** None.

**Params:** 

User id to delete.

``
_id: string
``

**Body:** None.

**Success return:** None.

---

### **Recover User**:

> Recovers and returns all of a user's data.

**Endpoint:** `GET warren_service/:_id`

**Requires Auth:** Yes.

**Query:** None.

**Params:** 

User id from which to get the data.

``
_id: string
``

**Body:** None.

**Success return:**

User data (no password):

```
{
  _id: string
  categories[]: 
    name: string
    iconIndex: number
    colour: string
    transactions[]: 
      name: string
      date: string
      amount: number
      sourceOrDestination: string
      transactionType: 'deposit' | 'withdraw'
      paymentType: string
      walletId: number
      description?: string
    description?: string
  wallets[]: 
    name: string
    iconIndex: number
    colour: string
}
```

---

### **Update User**:

> Updates a registered user's category, transaction and wallet data.

**Endpoint:** `PUT warren_service/:_id`

**Requires Auth:** Yes.

**Query:** None.

**Params:** 

User id to update.

``
_id: string
``

**Body:**

Body with which to update the user (_id and password not included):

```
{
  categories[]: 
    name: string
    iconIndex: number
    colour: string
    transactions[]: 
      name: string
      date: string
      amount: number
      sourceOrDestination: string
      transactionType: 'deposit' | 'withdraw'
      paymentType: string
      walletId: number
      description?: string
    description?: string
  wallets[]: 
    name: string
    iconIndex: number
    colour: string
}
```

**Success return:**

Resulting user data after update (no password):

```
{
  _id: string
  categories[]: 
    name: string
    iconIndex: number
    colour: string
    transactions[]: 
      name: string
      date: string
      amount: number
      sourceOrDestination: string
      transactionType: 'deposit' | 'withdraw'
      paymentType: string
      walletId: number
      description?: string
    description?: string
  wallets[]: 
    name: string
    iconIndex: number
    colour: string
}
```

---

### **Get User Balances in Period**:

> Recovers a registered user's balances within a specified interval.

**Endpoint:** `GET warren_service/:_id/balances/:startingMonth/:endingMonth`

**Requires Auth:** Yes.

**Query:** None.

**Params:** 

User id from which to recover data, starting and ending months of relevant period.

``
  _id: string
  startingMonth: string
  endingMonth: string
``


**Body:** None.

**Success return:**

An array of all balances with their respective months, ordered from oldest to newest:

Each index of the array has the following format:
```
{
  date: string
  balance: number
}
```

---

### **Get User Transfer Amounts in Period**:

> Recovers a registered user's transfer (deposits & withdraws) amounts within a specified interval.

**Endpoint:** `GET warren_service/:_id/transfers/:startingMonth/:endingMonth`

**Requires Auth:** Yes.

**Query:** None.

**Params:** 

User id from which to recover data, starting and ending months of relevant period.

``
  _id: string
  startingMonth: string
  endingMonth: string
``

**Body:** None.

**Success return:**

The total amount of money that was deposited and withdrawn from the user's account within the provided interval.

```
{
  deposits: number
  withdraws: number
}
```

## Authors

* [**João Gabriel Setubal Pires**](https://github.com/jgspires)
* [**Marcela Braga Bahia**](https://github.com/mrssolarisdev)

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
