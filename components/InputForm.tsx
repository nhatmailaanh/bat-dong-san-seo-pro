import React from 'react';
import { PropertyData, LoadingState } from '../types';

interface InputFormProps {
  data: PropertyData;
  onChange: (field: keyof PropertyData, value: string) => void;
  onSubmit: () => void;
  loadingState: LoadingState;
}

const InputForm: React.FC<InputFormProps> = ({ data, onChange, onSubmit, loadingState }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.name as keyof PropertyData, e.target.value);
  };

  const isLoading = loadingState === LoadingState.LOADING;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        Thông tin Bất Động Sản
      </h2>
      
      <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar">
        {/* Type & Area */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại hình</label>
            <select 
              name="type" 
              value={data.type} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Chọn loại hình</option>
              <option value="Căn hộ chung cư">Căn hộ chung cư</option>
              <option value="Nhà phố">Nhà phố</option>
              <option value="Đất nền">Đất nền</option>
              <option value="Biệt thự">Biệt thự</option>
              <option value="Văn phòng">Văn phòng</option>
              <option value="Phòng trọ">Phòng trọ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diện tích</label>
            <input
              type="text"
              name="area"
              value={data.area}
              onChange={handleChange}
              placeholder="VD: 85m2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Price & Project */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán/thuê</label>
            <input
              type="text"
              name="price"
              value={data.price}
              onChange={handleChange}
              placeholder="VD: 5.2 tỷ"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Dự án (nếu có)</label>
            <input
              type="text"
              name="project"
              value={data.project}
              onChange={handleChange}
              placeholder="VD: Vinhomes Grand Park"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí / Địa chỉ</label>
          <input
            type="text"
            name="location"
            value={data.location}
            onChange={handleChange}
            placeholder="VD: Mặt tiền đường Nguyễn Xiển, TP. Thủ Đức"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiện ích nổi bật</label>
          <textarea
            name="amenities"
            value={data.amenities}
            onChange={handleChange}
            rows={3}
            placeholder="VD: Hồ bơi, gần trường học, view công viên, nội thất full..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
          />
        </div>

        {/* Legal & Contact */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pháp lý</label>
            <input
              type="text"
              name="legal"
              value={data.legal}
              onChange={handleChange}
              placeholder="VD: Sổ hồng riêng"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Liên hệ</label>
            <input
              type="text"
              name="contact"
              value={data.contact}
              onChange={handleChange}
              placeholder="VD: 0909xxxxxx (Mr. A)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-xl text-white font-bold shadow-lg transition-all duration-300 flex justify-center items-center gap-2 ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tối ưu hóa...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Tạo Nội Dung SEO
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;