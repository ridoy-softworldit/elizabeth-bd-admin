"use client"
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useGetSteadfastBalanceQuery,
  useCreateSteadfastOrderMutation,
  useLazyGetSteadfastStatusByInvoiceQuery,
} from "@/redux/featured/courier/steadfastApi";
import {
  useCreateOrderMutation as usePathaoCreateOrder,
  useCreateStoreMutation,
  useGetStoresQuery,
  useLazyGetCitiesQuery,
  useLazyGetZonesQuery,
  useLazyGetAreasQuery,
  useIssueTokenMutation,
  useLazyGetOrderInfoQuery,
} from "@/redux/featured/courier/pathaoApi";

type CourierProvider = 'steadfast' | 'pathao';

export default function CourierManagement() {
  const [selectedCourier, setSelectedCourier] = useState<CourierProvider>('steadfast');
  const [activeTab, setActiveTab] = useState('order');

  const { data: balance, refetch: refetchBalance } = useGetSteadfastBalanceQuery();
  const [createSteadfastOrder, { isLoading: steadfastOrderLoading }] = useCreateSteadfastOrderMutation();
  const [getStatusByInvoice] = useLazyGetSteadfastStatusByInvoiceQuery();
  const [getPathaoOrderInfo] = useLazyGetOrderInfoQuery();

  const [createPathaoOrder, { isLoading: pathaoOrderLoading }] = usePathaoCreateOrder();
  const [createStore, { isLoading: storeLoading }] = useCreateStoreMutation();
  const { data: stores, refetch: refetchStores } = useGetStoresQuery();
  const [getCities] = useLazyGetCitiesQuery();
  const [getZones] = useLazyGetZonesQuery();
  const [getAreas] = useLazyGetAreasQuery();
  const [issueToken] = useIssueTokenMutation();

  const [steadfastForm, setSteadfastForm] = useState({
    invoice: '', recipient_name: '', recipient_phone: '', recipient_address: '', cod_amount: 0, note: ''
  });

  const [pathaoForm, setPathaoForm] = useState({
    store_id: 0, merchant_order_id: '', recipient_name: '', recipient_phone: '', recipient_address: '',
    delivery_type: 48, item_type: 2, special_instruction: '', item_quantity: 1, item_weight: '0.5',
    item_description: '', amount_to_collect: 0
  });

  const [trackingInput, setTrackingInput] = useState('');
  const [cities, setCities] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [storeForm, setStoreForm] = useState({
    name: '', contact_name: '', contact_number: '', secondary_contact: '', address: '', city_id: 0, zone_id: 0, area_id: 0
  });

  const [orderResult, setOrderResult] = useState<any>(null);
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleCreateOrder = async () => {
    try {
      if (selectedCourier === 'steadfast') {
        const result = await createSteadfastOrder(steadfastForm).unwrap();
        const trackingCode = (result as any).tracking_code || 'N/A';
        setOrderResult({ success: true, data: result });
        toast.success(`Order created! Tracking: ${trackingCode}`);
        setSteadfastForm({ invoice: '', recipient_name: '', recipient_phone: '', recipient_address: '', cod_amount: 0, note: '' });
      } else {
        await issueToken().unwrap();
        const result = await createPathaoOrder(pathaoForm as any).unwrap();
        setOrderResult({ success: true, data: result });
        const consignmentId = (result as any)?.data?.data?.consignment_id || 'N/A';
        toast.success(`Order created! Consignment: ${consignmentId}`);
        setPathaoForm({ store_id: 0, merchant_order_id: '', recipient_name: '', recipient_phone: '', recipient_address: '', delivery_type: 48, item_type: 2, special_instruction: '', item_quantity: 1, item_weight: '0.5', item_description: '', amount_to_collect: 0 });
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      
      // Extract error message from various possible error structures
      let errorMsg = 'Failed to create order';
      
      if (err?.data?.message) {
        errorMsg = err.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      } else if (err?.error) {
        errorMsg = typeof err.error === 'string' ? err.error : 'Failed to create order';
      } else if (err?.status === 500) {
        errorMsg = 'Server error. Please check API credentials.';
      }
      
      // Show user-friendly error for invalid credentials
      if (errorMsg.toLowerCase().includes('invalid') && errorMsg.toLowerCase().includes('credential')) {
        toast.error('⚠️ Invalid API credentials. Contact Steadfast support for valid credentials.');
      } else {
        toast.error(errorMsg);
      }
    }
  };

  const handleTracking = async () => {
    try {
      if (selectedCourier === 'steadfast') {
        const result = await getStatusByInvoice(trackingInput).unwrap();
        setTrackingResult({ success: true, data: result });
      } else {
        await issueToken().unwrap();
        const result = await getPathaoOrderInfo(trackingInput).unwrap();
        setTrackingResult({ success: true, data: result });
      }
    } catch (err: any) {
      toast.error('Tracking failed');
    }
  };

  const tabs = [
    ...(selectedCourier === 'steadfast' ? [{ id: 'balance', label: '💰 Balance' }] : []),
    { id: 'order', label: '📦 Create Order' },
    { id: 'tracking', label: '📍 Tracking' },
    ...(selectedCourier === 'pathao' ? [{ id: 'setup', label: '🏪 Store Setup' }] : []),
  ];

  const loadCities = async () => {
    try {
      await issueToken().unwrap();
      const result = await getCities().unwrap();
      const citiesData = (result as any)?.data?.data?.data || result || [];
      setCities(Array.isArray(citiesData) ? citiesData : []);
    } catch (err: any) {
      toast.error('Failed to load cities');
    }
  };

  const loadZones = async (cityId: number) => {
    try {
      await issueToken().unwrap();
      const result = await getZones(cityId).unwrap();
      const zonesData = (result as any)?.data?.data?.data || result || [];
      setZones(Array.isArray(zonesData) ? zonesData : []);
      setAreas([]);
    } catch (err: any) {
      toast.error('Failed to load zones');
    }
  };

  const loadAreas = async (zoneId: number) => {
    try {
      await issueToken().unwrap();
      const result = await getAreas(zoneId).unwrap();
      const areasData = (result as any)?.data?.data?.data || result || [];
      setAreas(Array.isArray(areasData) ? areasData : []);
    } catch (err: any) {
      toast.error('Failed to load areas');
    }
  };

  const handleCreateStore = async () => {
    try {
      await issueToken().unwrap();
      await createStore(storeForm).unwrap();
      toast.success('Store created! Wait 1 hour for approval');
      setStoreForm({ name: '', contact_name: '', contact_number: '', secondary_contact: '', address: '', city_id: 0, zone_id: 0, area_id: 0 });
      refetchStores();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create store');
    }
  };

  React.useEffect(() => {
    if (selectedCourier === 'pathao' && activeTab === 'setup') {
      loadCities();
    }
  }, [selectedCourier, activeTab]);

  React.useEffect(() => {
    if (selectedCourier === 'pathao') {
      refetchStores();
    }
  }, [selectedCourier]);

  React.useEffect(() => {
    if (Array.isArray(stores) && stores.length > 0 && pathaoForm.store_id === 0) {
      setPathaoForm(prev => ({ ...prev, store_id: stores[0].store_id }));
    }
  }, [stores]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Courier Management</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4">
            <button onClick={() => setSelectedCourier('steadfast')} className={`flex-1 py-3 px-4 rounded-lg border-2 ${selectedCourier === 'steadfast' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
              <div className="font-semibold">🚚 Steadfast</div>
              {balance && <div className="text-sm text-gray-600">Balance: {balance.current_balance} {balance.currency}</div>}
            </button>
            <button onClick={() => setSelectedCourier('pathao')} className={`flex-1 py-3 px-4 rounded-lg border-2 ${selectedCourier === 'pathao' ? 'border-green-600 bg-green-50' : 'border-gray-200'}`}>
              <div className="font-semibold">📦 Pathao</div>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'balance' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Check Balance</h2>
            <button onClick={() => refetchBalance()} className="bg-blue-600 text-white px-4 py-2 rounded">Refresh Balance</button>
            {balance && <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded"><strong>Balance:</strong> {balance.current_balance} {balance.currency}</div>}
          </div>
        )}

        {activeTab === 'setup' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Pathao Store Setup</h2>
            
            {Array.isArray(stores) && stores.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Your Stores</h3>
                {stores.map((store: any) => (
                  <div key={store.store_id} className="p-4 border rounded mb-2 bg-gray-50">
                    <p><strong>Store ID:</strong> {store.store_id}</p>
                    <p><strong>Name:</strong> {store.store_name}</p>
                    <p><strong>Status:</strong> {store.is_active ? '✅ Active' : '⏳ Pending'}</p>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium mb-3">Create New Store</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Store Name *</label><input type="text" value={storeForm.name} onChange={(e) => setStoreForm({...storeForm, name: e.target.value})} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Contact Name *</label><input type="text" value={storeForm.contact_name} onChange={(e) => setStoreForm({...storeForm, contact_name: e.target.value})} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Contact Number *</label><input type="text" placeholder="01712345678" value={storeForm.contact_number} onChange={(e) => setStoreForm({...storeForm, contact_number: e.target.value})} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Secondary Contact</label><input type="text" placeholder="01712345678" value={storeForm.secondary_contact} onChange={(e) => setStoreForm({...storeForm, secondary_contact: e.target.value})} className="w-full border rounded px-3 py-2" /></div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <select value={storeForm.city_id} onChange={(e) => { const id = Number(e.target.value); setStoreForm({...storeForm, city_id: id, zone_id: 0, area_id: 0}); if(id > 0) loadZones(id); }} className="w-full border rounded px-3 py-2">
                      <option value={0}>Select City</option>
                      {Array.isArray(cities) && cities.map((city: any) => <option key={city.city_id} value={city.city_id}>{city.city_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Zone *</label>
                    <select value={storeForm.zone_id} onChange={(e) => { const id = Number(e.target.value); setStoreForm({...storeForm, zone_id: id, area_id: 0}); loadAreas(id); }} className="w-full border rounded px-3 py-2" disabled={!storeForm.city_id}>
                      <option value={0}>Select Zone</option>
                      {Array.isArray(zones) && zones.map((zone: any) => <option key={zone.zone_id} value={zone.zone_id}>{zone.zone_name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Area *</label>
                    <select value={storeForm.area_id} onChange={(e) => setStoreForm({...storeForm, area_id: Number(e.target.value)})} className="w-full border rounded px-3 py-2" disabled={!storeForm.zone_id}>
                      <option value={0}>Select Area</option>
                      {Array.isArray(areas) && areas.map((area: any) => <option key={area.area_id} value={area.area_id}>{area.area_name}</option>)}
                    </select>
                  </div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Store Address *</label><textarea value={storeForm.address} onChange={(e) => setStoreForm({...storeForm, address: e.target.value})} className="w-full border rounded px-3 py-2" rows={3} placeholder="House 123, Road 4, Sector 10, Uttara, Dhaka-1230" /></div>
                <button onClick={handleCreateStore} disabled={storeLoading} className="bg-green-600 text-white px-6 py-2 rounded">{storeLoading ? 'Creating...' : 'Create Store'}</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'order' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Create Order</h2>
            {selectedCourier === 'steadfast' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Invoice *</label><input type="text" value={steadfastForm.invoice} onChange={(e) => setSteadfastForm({...steadfastForm, invoice: e.target.value})} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Recipient Name *</label><input type="text" value={steadfastForm.recipient_name} onChange={(e) => setSteadfastForm({...steadfastForm, recipient_name: e.target.value})} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Phone *</label><input type="text" value={steadfastForm.recipient_phone} onChange={(e) => setSteadfastForm({...steadfastForm, recipient_phone: e.target.value})} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">COD Amount *</label><input type="number" value={steadfastForm.cod_amount} onChange={(e) => setSteadfastForm({...steadfastForm, cod_amount: Number(e.target.value)})} className="w-full border rounded px-3 py-2" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Address *</label><textarea value={steadfastForm.recipient_address} onChange={(e) => setSteadfastForm({...steadfastForm, recipient_address: e.target.value})} className="w-full border rounded px-3 py-2" rows={2} /></div>
                <button onClick={handleCreateOrder} disabled={steadfastOrderLoading} className="bg-green-600 text-white px-6 py-2 rounded">{steadfastOrderLoading ? 'Creating...' : 'Create Order'}</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Store *</label>
                    <select value={pathaoForm.store_id} onChange={(e) => setPathaoForm({...pathaoForm, store_id: Number(e.target.value)})} className="w-full border rounded px-3 py-2">
                      <option value={0}>Select Store</option>
                      {Array.isArray(stores) && stores.map((store: any) => (
                        <option key={store.store_id} value={store.store_id}>{store.store_name} (ID: {store.store_id})</option>
                      ))}
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium mb-1">Merchant Order ID</label><input type="text" value={pathaoForm.merchant_order_id} onChange={(e) => setPathaoForm({...pathaoForm, merchant_order_id: e.target.value})} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Recipient Name *</label><input type="text" value={pathaoForm.recipient_name} onChange={(e) => setPathaoForm({...pathaoForm, recipient_name: e.target.value})} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Phone *</label><input type="text" value={pathaoForm.recipient_phone} onChange={(e) => setPathaoForm({...pathaoForm, recipient_phone: e.target.value})} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Delivery Type *</label><select value={pathaoForm.delivery_type} onChange={(e) => setPathaoForm({...pathaoForm, delivery_type: Number(e.target.value)})} className="w-full border rounded px-3 py-2"><option value={48}>Normal (48h)</option><option value={12}>On Demand (12h)</option></select></div>
                  <div><label className="block text-sm font-medium mb-1">Item Type *</label><select value={pathaoForm.item_type} onChange={(e) => setPathaoForm({...pathaoForm, item_type: Number(e.target.value)})} className="w-full border rounded px-3 py-2"><option value={1}>Document</option><option value={2}>Parcel</option></select></div>
                  <div><label className="block text-sm font-medium mb-1">Item Quantity *</label><input type="number" value={pathaoForm.item_quantity} onChange={(e) => setPathaoForm({...pathaoForm, item_quantity: Number(e.target.value)})} className="w-full border rounded px-3 py-2" min="1" /></div>
                  <div><label className="block text-sm font-medium mb-1">Weight (kg) *</label><input type="text" value={pathaoForm.item_weight} onChange={(e) => setPathaoForm({...pathaoForm, item_weight: e.target.value})} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm font-medium mb-1">Amount to Collect *</label><input type="number" value={pathaoForm.amount_to_collect} onChange={(e) => setPathaoForm({...pathaoForm, amount_to_collect: Number(e.target.value)})} className="w-full border rounded px-3 py-2" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Address *</label><textarea value={pathaoForm.recipient_address} onChange={(e) => setPathaoForm({...pathaoForm, recipient_address: e.target.value})} className="w-full border rounded px-3 py-2" rows={2} /></div>
                <div><label className="block text-sm font-medium mb-1">Item Description</label><textarea value={pathaoForm.item_description} onChange={(e) => setPathaoForm({...pathaoForm, item_description: e.target.value})} className="w-full border rounded px-3 py-2" rows={2} /></div>
                <div><label className="block text-sm font-medium mb-1">Special Instruction</label><textarea value={pathaoForm.special_instruction} onChange={(e) => setPathaoForm({...pathaoForm, special_instruction: e.target.value})} className="w-full border rounded px-3 py-2" rows={2} /></div>
                <button onClick={handleCreateOrder} disabled={pathaoOrderLoading} className="bg-green-600 text-white px-6 py-2 rounded">{pathaoOrderLoading ? 'Creating...' : 'Create Order'}</button>
              </div>
            )}
            {orderResult && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <h3 className="font-semibold mb-2 text-green-800">✅ Order Created</h3>
                <pre className="text-sm overflow-auto">{JSON.stringify(orderResult.data, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Track Order</h2>
            <div className="flex gap-4">
              <input type="text" placeholder="Enter Invoice/Consignment ID" value={trackingInput} onChange={(e) => setTrackingInput(e.target.value)} className="flex-1 border rounded px-3 py-2" />
              <button onClick={handleTracking} className="bg-blue-600 text-white px-6 py-2 rounded">Track</button>
            </div>
            {trackingResult && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <pre className="text-sm overflow-auto">{JSON.stringify(trackingResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
