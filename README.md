# taoweblan17

## Tai lieu

- [Phan tich flow check dia chi SoftBank](./docs/softbank-address-check-flow.md)

## Demo clone flow

Mo trang voi query param `individualCode`:

- `/?individualCode=422sLcGAVUfqK`

Trang demo se cho test skeleton 4 buoc:

1. Search address
1.5. Chome -> Banchi/Go
2. Normalize
3. Detail
4. Availability (co retry fallback)

## Live-only den GOU (SB)

- Session guard lay that tu endpoint SB:
  - `POST /aqw-api/composition/individualCd/decision`
- Zipcode search lay that tu endpoint SB:
  - `GET /aqw-api/composition/search/address/{zip3}/{zip4}`

Luong dang chay:

1. `search/address` (live)
2. `detailAddressSearch requestKbn=1` -> banchi (live)
3. `detailAddressSearch requestKbn=2` -> gou (live)

Chi tiet:

- `banchi` va `gou` lay live tu SB qua `detailAddressSearch`:
  - `requestKbn=1` -> `addressBanchiList`
  - `requestKbn=2` -> `addressGoList`
- Tam thoi bo qua buoc ten toa nha, de flow chuan den `GOU`.

## Ghi chu

- Ban nay da bo data source switch trong UI, mac dinh live den `GOU`.
- Cac step normalize/detail/availability o duoi van la skeleton noi bo de test tiep flow.
