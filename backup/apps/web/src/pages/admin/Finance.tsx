import React, { useEffect, useState } from 'react'
import { Download, Printer, Filter, Loader2, ArrowRight } from 'lucide-react'
import api from '../../lib/api'
import { toast } from 'sonner'

interface FinanceReport {
  totalRevenue: number
  ordersCount: number
  packageBreakdown: Array<{ name: string; count: number; sum: number }>
  methodBreakdown: Array<{ name: string; count: number; sum: number }>
  orders: Array<{
    id: string
    amount: number
    paymentMethod: string | null
    paidAt: string | null
    packageName: string | null
  }>
}

export const AdminFinance: React.FC = () => {
  const [report, setReport] = useState<FinanceReport | null>(null)
  const [loading, setLoading] = useState(true)

  // Filter dates (default to start of month to today)
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0]
  })

  const fetchFinanceReport = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/finance', {
        params: {
          start: startDate,
          end: endDate,
        },
      })
      setReport(response.data.report)
    } catch (err: any) {
      toast.error('Gagal memuat laporan keuangan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFinanceReport()
  }, [])

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchFinanceReport()
  }

  // Export report to CSV
  const handleExportCSV = () => {
    if (!report || report.orders.length === 0) return
    const headers = 'ID Invoice,Paket,Jumlah,Metode,Tanggal Bayar\n'
    const rows = report.orders
      .map(
        (o) =>
          `"INV-${o.id.substring(0, 8).toUpperCase()}","${o.packageName || '-'}",${o.amount},"${
            o.paymentMethod || '-'
          }","${o.paidAt ? new Date(o.paidAt).toLocaleDateString('id-ID') : '-'}"`
      )
      .join('\n')

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `laporan-keuangan-${startDate}-to-${endDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Print layout
  const handlePrint = () => {
    window.print()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-8 print:bg-white print:text-black">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white">Laporan Keuangan</h1>
          <p className="text-sm text-slate-400">Rekap omset pendapatan dan analisis penjualan paket</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
          >
            <Printer size={16} />
            <span>Cetak Laporan</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Print-Only Header */}
      <div className="hidden print:block border-b border-slate-300 pb-4 mb-6">
        <h1 className="text-2xl font-serif font-bold text-slate-950">Laporan Transaksi Keuangan Ngaturi</h1>
        <p className="text-sm text-slate-600 mt-1">
          Periode: {new Date(startDate).toLocaleDateString('id-ID')} s.d.{' '}
          {new Date(endDate).toLocaleDateString('id-ID')}
        </p>
      </div>

      {/* Date Range Filter Form */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl print:hidden">
        <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Dari Tanggal
            </label>
            <div className="relative rounded-xl">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-center text-slate-500 h-10 hidden md:flex">
            <ArrowRight size={18} />
          </div>

          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Sampai Tanggal
            </label>
            <div className="relative rounded-xl">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-100 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Filter size={16} />
            <span>Terapkan Filter</span>
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 print:hidden">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      ) : (
        report && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 print:border-slate-300 p-6 rounded-2xl">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pendapatan (Omset)</span>
                <h3 className="text-3xl font-serif font-bold text-white print:text-slate-950 mt-2">
                  {formatCurrency(report.totalRevenue)}
                </h3>
              </div>

              <div className="bg-slate-900 border border-slate-800 print:border-slate-300 p-6 rounded-2xl">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jumlah Transaksi Lunas</span>
                <h3 className="text-3xl font-serif font-bold text-white print:text-slate-950 mt-2">
                  {report.ordersCount} Transaksi
                </h3>
              </div>
            </div>

            {/* Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Package Breakdown */}
              <div className="bg-slate-900 border border-slate-800 print:border-slate-300 p-6 rounded-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white print:text-slate-950">Breakdown Penjualan Paket</h3>
                  <p className="text-xs text-slate-500 print:hidden">Performa penjualan berdasarkan tier paket</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-400 print:text-slate-600 border-b border-slate-800 print:border-slate-300">
                        <th className="py-2 font-semibold">Nama Paket</th>
                        <th className="py-2 font-semibold text-center">Jumlah Terjual</th>
                        <th className="py-2 font-semibold text-right">Total Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 print:divide-slate-300">
                      {report.packageBreakdown.length > 0 ? (
                        report.packageBreakdown.map((pb, i) => (
                          <tr key={i} className="text-slate-300 print:text-slate-800">
                            <td className="py-3 font-semibold">{pb.name}</td>
                            <td className="py-3 text-center">{pb.count}x</td>
                            <td className="py-3 text-right font-bold">{formatCurrency(pb.sum)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-4 text-center text-slate-500">
                            Tidak ada data penjualan paket.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Method Breakdown */}
              <div className="bg-slate-900 border border-slate-800 print:border-slate-300 p-6 rounded-2xl space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white print:text-slate-950">Breakdown Metode Pembayaran</h3>
                  <p className="text-xs text-slate-500 print:hidden">Metode pembayaran paling populer digunakan customer</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-400 print:text-slate-600 border-b border-slate-800 print:border-slate-300">
                        <th className="py-2 font-semibold">Metode</th>
                        <th className="py-2 font-semibold text-center">Jumlah Transaksi</th>
                        <th className="py-2 font-semibold text-right">Total Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 print:divide-slate-300">
                      {report.methodBreakdown.length > 0 ? (
                        report.methodBreakdown.map((mb, i) => (
                          <tr key={i} className="text-slate-300 print:text-slate-800">
                            <td className="py-3 font-semibold">{mb.name}</td>
                            <td className="py-3 text-center">{mb.count}x</td>
                            <td className="py-3 text-right font-bold">{formatCurrency(mb.sum)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-4 text-center text-slate-500">
                            Tidak ada data metode pembayaran.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Detailed Transaction Log */}
            <div className="bg-slate-900 border border-slate-800 print:border-slate-300 p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white print:text-slate-950">Detail Jurnal Transaksi Lunas</h3>
                <p className="text-xs text-slate-500 print:hidden">Log rinci seluruh transaksi masuk pada periode terpilih</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-400 print:text-slate-600 border-b border-slate-800 print:border-slate-300">
                      <th className="py-3 px-4 font-semibold">Invoice</th>
                      <th className="py-3 px-4 font-semibold">Paket</th>
                      <th className="py-3 px-4 font-semibold">Jumlah</th>
                      <th className="py-3 px-4 font-semibold">Metode</th>
                      <th className="py-3 px-4 font-semibold text-right">Tanggal Lunas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 print:divide-slate-300">
                    {report.orders.length > 0 ? (
                      report.orders.map((o) => (
                        <tr key={o.id} className="text-slate-350 print:text-slate-850 hover:bg-slate-800/10">
                          <td className="py-3 px-4 font-mono font-semibold">INV-{o.id.substring(0, 8).toUpperCase()}</td>
                          <td className="py-3 px-4">{o.packageName || '-'}</td>
                          <td className="py-3 px-4 font-bold text-white print:text-slate-950">{formatCurrency(o.amount)}</td>
                          <td className="py-3 px-4 text-slate-400 print:text-slate-600">{o.paymentMethod || '-'}</td>
                          <td className="py-3 px-4 text-right text-slate-500 print:text-slate-600">
                            {o.paidAt ? new Date(o.paidAt).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          Tidak ada transaksi pada periode ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default AdminFinance
