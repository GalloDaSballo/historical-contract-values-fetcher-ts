# historical-contract-values-fetcher-ts

Fetches historical values for a function and a contract

Stores the values in a JSON file

## Usage

- Add .env
- Change `CONSTANTS`
- Send it

## Requirements

Alchemy Key

Patience



## Output
Is of type 

```ts
interface Reads {
  block: number;
  value: number;
}
```


## Advanced

If you can handle more requests (pro RPC)

Change `ROUND_PER_CALL` to a high number, which will have concurrent requests to speed the process up