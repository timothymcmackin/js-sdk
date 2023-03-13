import {
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'

import { CheckoutModal } from '@/components'
import { useDappContext } from '@/hooks'

const PaymentWallets = () => {
  const { provider } = useDappContext()

  return (
    <>
      {provider?.address ? (
        <CheckoutModal />
      ) : (
        <>
          <Typography fontWeight="bold" variant="h6">
            Choose your payment wallet
          </Typography>

          <Divider />

          <List>
            <ListItemButton
              onClick={() => {
                provider?.connect()
              }}
            >
              <ListItemIcon>
                <img
                  src="https://img.icons8.com/color/48/null/metamask-logo.png"
                  width={34}
                  height={34}
                  alt="Metamask icon"
                />
              </ListItemIcon>
              <ListItemText
                id="switch-list-label-metamask"
                primary="MetaMask"
              />
            </ListItemButton>
          </List>
        </>
      )}
    </>
  )
}

export default PaymentWallets
