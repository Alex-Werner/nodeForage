# nodeForage

Lightweight nodeJS equivalent of localForage, using JSON file.

## Install 

`npm install nodeforage`

## Usage

```js
  const { NodeForage } = require('nodeforage');
  const nodeforage = new NodeForage({name:'users'});
  
 
  await nodeforage.setItem('John', {password:'notsupersecure', username:'John', email:'john@doe.fr'});
  const johnUser = await nodeforage.getItem('John')
  const findHim = await nodeforage.findItem({email:"john@doe.fr"}); 
```

## getItem 

`nodeforage.getItem(key)`
- key - Key to fetch

## setItem 

`nodeforage.setItem(key, value)`
- key - Key under which storing
- value - Object to store

## FindItem 

`nodeforage.findItem(searchParams)`
- searchParams - Object of element to match

## Next 

It is planned to load locally and then deal with the filesystem changes, but for now, it's constant read/write.
