import { fetchTransactionsByAddress, fetchTransactionByHash } from '../http/fetcher'
import { PageActions, AppDispatchType } from '../../contexts/providers/reducer'
import { FetchStatus } from '../../contexts/states'

export const getTransactionsByAddress = (hash: string, page: number, size: number, dispatch: any) => {
  fetchTransactionsByAddress(hash, page, size)
    .then(response => {
      const { data, meta } = response as Response.Response<Response.Wrapper<State.Transaction>[]>
      dispatch({
        type: PageActions.UpdateAddressTransactions,
        payload: {
          transactions:
            data.map((wrapper: Response.Wrapper<State.Transaction>) => {
              return wrapper.attributes
            }) || [],
        },
      })
      dispatch({
        type: PageActions.UpdateAddressTotal,
        payload: {
          total: meta ? meta.total : 0,
        },
      })
    })
    .catch(() => {
      dispatch({
        type: PageActions.UpdateAddressTransactions,
        payload: {
          transactions: [],
        },
      })
      dispatch({
        type: PageActions.UpdateAddressTotal,
        payload: {
          total: 0,
        },
      })
    })
}

export const getTransactionByHash = (
  hash: string,
  dispatch: AppDispatchType<{ transaction?: State.Transaction; status?: FetchStatus }>,
  callback: Function,
) => {
  fetchTransactionByHash(hash)
    .then((wrapper: Response.Wrapper<State.Transaction> | null) => {
      callback()
      if (wrapper) {
        const transactionValue = wrapper.attributes
        if (transactionValue.displayOutputs && transactionValue.displayOutputs.length > 0) {
          transactionValue.displayOutputs[0].isGenesisOutput = transactionValue.blockNumber === 0
        }
        dispatch({
          type: PageActions.UpdateTransaction,
          payload: {
            transaction: transactionValue,
          },
        })
        dispatch({
          type: PageActions.UpdateTransactionStatus,
          payload: {
            status: 'OK',
          },
        })
      } else {
        dispatch({
          type: PageActions.UpdateTransactionStatus,
          payload: {
            status: 'Error',
          },
        })
      }
    })
    .catch(() => {
      callback()
      dispatch({
        type: PageActions.UpdateTransactionStatus,
        payload: {
          status: 'Error',
        },
      })
    })
}
