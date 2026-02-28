"use client"
import React, { useCallback, useEffect } from 'react';
import { CourierProvider, SteadfastForm, PathaoForm, CourierResult, PendingStatusUpdate } from '@/types/Courier';
import { useGetStoresQuery } from '@/redux/featured/courier/pathaoApi';

interface MultiCourierModalProps {
  showModal: boolean;
  courierStep: 'select' | 'form';
  selectedCourier: CourierProvider | null;
  pendingStatusUpdate: PendingStatusUpdate | null;
  steadfastForm: SteadfastForm;
  pathaoForm: PathaoForm;
  courierResult: CourierResult | null;
  steadfastLoading: boolean;
  pathaoLoading: boolean;
  onClose: () => void;
  onCourierSelect: (courier: CourierProvider) => void;
  onBackToSelection: () => void;
  onSteadfastFormChange: (data: SteadfastForm) => void;
  onPathaoFormChange: (data: PathaoForm) => void;
  onCreateOrder: () => void;
}

export default function MultiCourierModal({
  showModal,
  courierStep,
  selectedCourier,
  pendingStatusUpdate,
  steadfastForm,
  pathaoForm,
  courierResult,
  steadfastLoading,
  pathaoLoading,
  onClose,
  onCourierSelect,
  onBackToSelection,
  onSteadfastFormChange,
  onPathaoFormChange,
  onCreateOrder,
}: MultiCourierModalProps) {
  const { data: stores = [] } = useGetStoresQuery();
  
  useEffect(() => {
    if (stores.length > 0 && pathaoForm.store_id === 0) {
      onPathaoFormChange({ ...pathaoForm, store_id: stores[0].store_id });
    }
  }, [stores, pathaoForm.store_id]);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal, onClose]);

  const handleSteadfastChange = useCallback((field: keyof SteadfastForm, value: string | number) => {
    onSteadfastFormChange({ ...steadfastForm, [field]: value });
  }, [steadfastForm, onSteadfastFormChange]);

  const handlePathaoChange = useCallback((field: keyof PathaoForm, value: string | number) => {
    onPathaoFormChange({ ...pathaoForm, [field]: value });
  }, [pathaoForm, onPathaoFormChange]);

  if (!showModal) return null;

  return (
    <div 
      className="bg-[#00000085] fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white p-6 rounded-xl shadow-2xl w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              {courierStep === 'select' ? (
                <>📦 Select Courier Provider</>
              ) : (
                <>
                  {selectedCourier === 'steadfast' ? '🚚' : '📦'} Create {selectedCourier === 'steadfast' ? 'Steadfast' : 'Pathao'} Order
                </>
              )}
            </h2>
            {pendingStatusUpdate && (
              <p className="text-sm text-gray-600 mt-1">
                Status will be updated to: <span className="font-medium capitalize">{pendingStatusUpdate.newStatus.replace("-", " ")}</span>
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">✕</button>
        </div>

        {courierStep === 'select' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-gray-600">Choose your preferred courier service for this order</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => onCourierSelect('steadfast')}
                className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-4xl mb-3">🚚</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Steadfast Courier</h3>
                    <p className="text-sm text-gray-600 mb-3">Reliable nationwide delivery service</p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Fast processing
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Real-time tracking
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        COD support
                      </div>
                    </div>
                  </div>
                  <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onCourierSelect('pathao')}
                className="group p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all duration-200 text-left"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-4xl mb-3">📦</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Pathao Courier</h3>
                    <p className="text-sm text-gray-600 mb-3">Fast & efficient delivery network</p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Normal & On-demand delivery
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Wide coverage area
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Competitive pricing
                      </div>
                    </div>
                  </div>
                  <div className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {courierStep === 'form' && selectedCourier && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={onBackToSelection} className="text-gray-500 hover:text-gray-700 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedCourier === 'steadfast' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {selectedCourier === 'steadfast' ? 'Steadfast Courier' : 'Pathao Courier'}
              </div>
            </div>

            {selectedCourier === 'steadfast' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number *</label>
                    <input
                      type="text"
                      value={steadfastForm.invoice}
                      onChange={(e) => handleSteadfastChange('invoice', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name *</label>
                    <input
                      type="text"
                      value={steadfastForm.recipient_name}
                      onChange={(e) => handleSteadfastChange('recipient_name', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={steadfastForm.recipient_phone}
                      onChange={(e) => {
                        let phone = e.target.value.replace(/\D/g, '');
                        if (phone.startsWith('88')) phone = phone.substring(2);
                        if (phone.length > 0 && !phone.startsWith('0')) phone = '0' + phone;
                        handleSteadfastChange('recipient_phone', phone);
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="01712345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Phone</label>
                    <input
                      type="tel"
                      value={steadfastForm.alternative_phone || ''}
                      onChange={(e) => {
                        let phone = e.target.value.replace(/\D/g, '');
                        if (phone.startsWith('88')) phone = phone.substring(2);
                        if (phone.length > 0 && !phone.startsWith('0')) phone = '0' + phone;
                        handleSteadfastChange('alternative_phone', phone);
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="01712345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">COD Amount *</label>
                    <input
                      type="number"
                      value={steadfastForm.cod_amount}
                      onChange={(e) => handleSteadfastChange('cod_amount', Math.max(0, Number(e.target.value)))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Lot</label>
                    <input
                      type="number"
                      value={steadfastForm.total_lot || ''}
                      onChange={(e) => handleSteadfastChange('total_lot', Math.max(0, Number(e.target.value)))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      placeholder="Number of lots"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Type</label>
                    <select
                      value={steadfastForm.delivery_type ?? ''}
                      onChange={(e) => handleSteadfastChange('delivery_type', e.target.value ? Number(e.target.value) : '')}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select delivery type</option>
                      <option value={0}>Home Delivery</option>
                      <option value={1}>Point Delivery/Hub Pick Up</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                    <input
                      type="email"
                      value={steadfastForm.recipient_email || ''}
                      onChange={(e) => handleSteadfastChange('recipient_email', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address *</label>
                  <textarea
                    value={steadfastForm.recipient_address}
                    onChange={(e) => handleSteadfastChange('recipient_address', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="House 123, Road 456, Dhaka"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Description</label>
                  <textarea
                    value={steadfastForm.item_description || ''}
                    onChange={(e) => handleSteadfastChange('item_description', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Product details"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Note</label>
                  <textarea
                    value={steadfastForm.note || ''}
                    onChange={(e) => handleSteadfastChange('note', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Delivery instructions or notes"
                  />
                </div>
              </div>
            )}

            {selectedCourier === 'pathao' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store *</label>
                    <select
                      value={pathaoForm.store_id}
                      onChange={(e) => handlePathaoChange('store_id', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={0}>Select a store</option>
                      {stores.map((store: any) => (
                        <option key={store.store_id} value={store.store_id}>
                          {store.store_name} - {store.store_address}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Merchant Order ID</label>
                    <input
                      type="text"
                      value={pathaoForm.merchant_order_id}
                      onChange={(e) => handlePathaoChange('merchant_order_id', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name *</label>
                    <input
                      type="text"
                      value={pathaoForm.recipient_name}
                      onChange={(e) => handlePathaoChange('recipient_name', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={pathaoForm.recipient_phone}
                      onChange={(e) => {
                        let phone = e.target.value.replace(/\D/g, '');
                        if (phone.startsWith('88')) phone = phone.substring(2);
                        if (phone.length > 0 && !phone.startsWith('0')) phone = '0' + phone;
                        if (phone.length > 11) phone = phone.substring(0, 11);
                        handlePathaoChange('recipient_phone', phone);
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="01712345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Type *</label>
                    <select
                      value={pathaoForm.delivery_type}
                      onChange={(e) => handlePathaoChange('delivery_type', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={48}>Normal Delivery (48h)</option>
                      <option value={12}>On Demand (12h)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Type *</label>
                    <select
                      value={pathaoForm.item_type}
                      onChange={(e) => handlePathaoChange('item_type', Number(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={1}>Document</option>
                      <option value={2}>Parcel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Weight (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="10"
                      value={pathaoForm.item_weight}
                      onChange={(e) => {
                        const weight = Math.max(0.5, Math.min(10, Number(e.target.value)));
                        handlePathaoChange('item_weight', weight.toString());
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.5 - 10.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Quantity *</label>
                    <input
                      type="number"
                      value={pathaoForm.item_quantity}
                      onChange={(e) => handlePathaoChange('item_quantity', Math.max(1, Number(e.target.value)))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Collect *</label>
                    <input
                      type="number"
                      value={pathaoForm.amount_to_collect}
                      onChange={(e) => handlePathaoChange('amount_to_collect', Math.max(0, Number(e.target.value)))}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address *</label>
                  <textarea
                    value={pathaoForm.recipient_address}
                    onChange={(e) => handlePathaoChange('recipient_address', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={2}
                    placeholder="House 123, Road 4, Sector 10, Uttara, Dhaka"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <textarea
                    value={pathaoForm.special_instruction}
                    onChange={(e) => handlePathaoChange('special_instruction', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={2}
                    placeholder="Any special delivery instructions"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Description</label>
                  <textarea
                    value={pathaoForm.item_description}
                    onChange={(e) => handlePathaoChange('item_description', e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={2}
                    placeholder="Product details"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={onCreateOrder}
                disabled={steadfastLoading || pathaoLoading}
                className={`px-6 py-3 rounded-lg text-white font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ${
                  selectedCourier === 'steadfast'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {(steadfastLoading || pathaoLoading) ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Order...
                  </span>
                ) : (
                  `Create ${selectedCourier === 'steadfast' ? 'Steadfast' : 'Pathao'} Order`
                )}
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>

            {courierResult && courierResult.success && courierResult.data && (
              <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-green-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-green-800">Order Created Successfully!</h3>
                </div>
                
                {selectedCourier === 'steadfast' && courierResult.data.consignment && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(courierResult.data.consignment)
                      .filter(([key]) => !['recipient_email', 'alternative_phone', 'note'].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="bg-white p-3 rounded border">
                          <div className="text-xs text-gray-500 uppercase">{key.replace(/_/g, ' ')}</div>
                          <div className="font-medium text-sm">{String(value ?? '—')}</div>
                        </div>
                      ))}
                  </div>
                )}
                
                {selectedCourier === 'pathao' && courierResult.data.data && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(courierResult.data.data)
                      .map(([key, value]) => (
                        <div key={key} className="bg-white p-3 rounded border">
                          <div className="text-xs text-gray-500 uppercase">{key.replace(/_/g, ' ')}</div>
                          <div className="font-medium text-sm">{String(value ?? '—')}</div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
