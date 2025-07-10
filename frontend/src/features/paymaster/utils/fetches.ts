import axios from 'axios'

import settings from 'settings'

const serverURL = settings[process.env.REACT_APP_DEPLOY_ENV].server_url

export const fetchPaymasters = async (param: string) => {
  const response = await axios.get(
    `${serverURL}/api/paymasters${param}`
  )

  return response.data
}
