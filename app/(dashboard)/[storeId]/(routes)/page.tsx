import { getGraphData } from '@/app/actions/get-graph-data'
import { getSalesCount } from '@/app/actions/get-sales-count'
import { getStockCount } from '@/app/actions/get-stock-count'
import { getTotalRevenue } from '@/app/actions/get-total-revenue'
import Overview from '@/components/overview'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { formatter } from '@/lib/utils'
import { CreditCard, DollarSign, Package } from 'lucide-react'

interface DashboardPageProps {
    params : { storeId : string }
}

const DashboardPage : React.FC<DashboardPageProps> = async ({
    params
}) => {

  const totalRevenue = await getTotalRevenue(params.storeId)
  const salesCount = await getSalesCount(params.storeId)
  const stockCount = await getStockCount(params.storeId)
  const graphData = await getGraphData(params.storeId)
  return (
    <div className='flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
          <Heading title='Dashboard' description='Overview of your store.' />
          <Separator />
          <div className='grid gap-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                        Total Revenue
                  </CardTitle>
                  <DollarSign className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>
                        {totalRevenue.toFixed(2)}
                    </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                        Sales
                  </CardTitle>
                  <CreditCard className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>
                        + {salesCount}
                    </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                  <CardTitle className='text-sm font-medium'>
                        Products In Stock
                  </CardTitle>
                  <Package className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>
                        {stockCount}
                    </div>
                </CardContent>
              </Card>
          </div>  
          <Card className='col-span-4'>
              <CardHeader>Overview</CardHeader>
              <CardContent className='pl-2'>
                  <Overview data={graphData} />
              </CardContent>
          </Card>
        </div>
    </div>
  )
}

export default DashboardPage
