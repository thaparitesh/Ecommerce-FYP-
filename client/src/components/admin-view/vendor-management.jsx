import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import VendorDetailsView from './vendor-details'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllVendors, fetchVendorDetails } from '@/store/admin/approveVendor-slice'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'

function VendorManagementView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const { vendors, currentVendor, loading } = useSelector(state => state.adminApproval)
  const dispatch = useDispatch()

  function handleFetchVendorDetails(vendorID) {
    dispatch(fetchVendorDetails(vendorID))
  }

  useEffect(() => {
    dispatch(fetchAllVendors())
  }, [dispatch])

  useEffect(() => {
    if (currentVendor !== null) {
      setOpenDetailsDialog(true)
    }
  }, [currentVendor])

  // Filter vendors based on active tab
  const filteredVendors = vendors?.filter(vendor => {
    if (activeTab === 'all') return true
    return vendor.status === activeTab
  })

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-red-400 text-red-800',
      default: 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs capitalize ${statusStyles[status.toLowerCase()] || statusStyles.default}`}>
        {status}
      </span>
    )
  }

  console.log(vendors, "vendorID");
  

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Vendor Management</CardTitle>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="suspended">Suspended</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors && filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <TableRow key={vendor.vendorID}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {vendor.businessLogo && (
                        <img 
                          src={vendor.businessLogo} 
                          alt={vendor.businessName}
                          className="w-8 h-8 rounded-md object-cover border"
                          onError={(e) => {
                            e.target.src = '/placeholder-vendor.jpg'
                            e.target.onerror = null
                          }}
                        />
                      )}
                      <span>{vendor.businessName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{vendor.ownerName}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>
                    <StatusBadge status={vendor.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFetchVendorDetails(vendor.vendorID)}
                      disabled={loading}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="text-muted-foreground">
                    No {activeTab === 'all' ? '' : activeTab} vendors found
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog
          open={openDetailsDialog}
          onOpenChange={(open) => {
            if (!open) {
              setOpenDetailsDialog(false)
              dispatch(resetVendorDetails())
            }
          }}
        >
          {currentVendor && <VendorDetailsView vendor={currentVendor} />}
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default VendorManagementView