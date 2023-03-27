import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import TransactionNewForm from '../../sections/@dashboard/transactions/TransactionsNewForm';

// ----------------------------------------------------------------------

export default function TransactionCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Transaction: Create a new transaction </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new transaction"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Transaction',
              href: PATH_DASHBOARD.transactions.list,
            },
            { name: 'New transaction' },
          ]}
        />
        <TransactionNewForm />
      </Container>
    </>
  );
}
