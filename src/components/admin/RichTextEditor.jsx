import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Indent, 
  Outdent, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  Type, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Unlink, 
  Quote, 
  Minus, 
  Undo, 
  Redo, 
  Code, 
  Eye, 
  Maximize2, 
  Minimize2, 
  Upload, 
  X, 
  Check, 
  Sparkles, 
  AlertCircle, 
  RotateCcw,
  Palette,
  Highlighter,
  Trash2,
  Loader2
} from 'lucide-react';
import { uploadImageToSupabase } from '../../lib/supabase';

// Bảng màu chữ thông dụng
const TEXT_COLORS = [
  { name: 'Đen đậm', value: '#1f0f09' },
  { name: 'Nâu cà phê', value: '#2b170e' },
  { name: 'Nâu hổ phách', value: '#8c5932' },
  { name: 'Đỏ cam nổi bật', value: '#dc2626' },
  { name: 'Cam cháy', value: '#ea580c' },
  { name: 'Xanh lá', value: '#16a34a' },
  { name: 'Xanh ngọc', value: '#0891b2' },
  { name: 'Xanh dương', value: '#2563eb' },
  { name: 'Xám đậm', value: '#4b5563' }
];

// Bảng màu highlight nền chữ
const HIGHLIGHT_COLORS = [
  { name: 'Không màu', value: 'transparent' },
  { name: 'Vàng kem', value: '#fef08a' },
  { name: 'Cam đào', value: '#fed7aa' },
  { name: 'Xanh bạc hà', value: '#bbf7d0' },
  { name: 'Xanh lơ nhạt', value: '#bae6fd' },
  { name: 'Hồng phấn', value: '#fbcfe8' }
];

export default function RichTextEditor({ 
  value = '', 
  onChange, 
  placeholder = 'Nhập nội dung bài viết hoặc chương trình khuyến mãi tại đây...',
  minHeight = '240px',
  maxHeight = '520px'
}) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const savedSelectionRef = useRef(null);

  const [viewMode, setViewMode] = useState('visual'); // 'visual' | 'code' | 'preview'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [htmlSource, setHtmlSource] = useState(value || '');

  // Dropdown states
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  // Image insertion state
  const [imageTab, setImageTab] = useState('upload'); // 'upload' | 'url'
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageWidth, setImageWidth] = useState('100%'); // '100%' | '75%' | '50%'
  const [imageAlign, setImageAlign] = useState('center'); // 'left' | 'center' | 'right'
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Link insertion state
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // Selected image in editor for quick edit
  const [selectedImgEl, setSelectedImgEl] = useState(null);

  // Sync value từ cha vào editor khi value đổi từ bên ngoài
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setHtmlSource(value || '');
  }, [value]);

  // Lưu lại vị trí con trỏ (Selection) để chèn ảnh / link / màu chính xác
  const saveSelection = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (typeof window === 'undefined') return;
    const sel = window.getSelection();
    if (savedSelectionRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  // Kích hoạt lệnh định dạng văn bản (execCommand)
  const execCmd = (cmd, val = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();
    document.execCommand(cmd, false, val);
    handleEditorInput();
  };

  // Cập nhật khi người dùng gõ hoặc sửa nội dung
  const handleEditorInput = useCallback(() => {
    if (!editorRef.current) return;
    const newHtml = editorRef.current.innerHTML;
    setHtmlSource(newHtml);
    if (typeof onChange === 'function') {
      onChange(newHtml);
    }
  }, [onChange]);

  // Đồng bộ từ chế độ sửa mã nguồn HTML sang Visual
  const handleSourceChange = (newVal) => {
    setHtmlSource(newVal);
    if (editorRef.current) {
      editorRef.current.innerHTML = newVal;
    }
    if (typeof onChange === 'function') {
      onChange(newVal);
    }
  };

  // Định dạng Block: H1, H2, H3, P
  const handleBlockFormat = (tag) => {
    execCmd('formatBlock', tag);
  };

  // Thay đổi cỡ chữ linh hoạt
  const handleFontSize = (sizePx) => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      alert('Vui lòng bôi đen đoạn chữ muốn đổi kích thước!');
      return;
    }
    const span = document.createElement('span');
    span.style.fontSize = sizePx;
    const range = sel.getRangeAt(0);
    span.appendChild(range.extractContents());
    range.insertNode(span);
    handleEditorInput();
  };

  // Áp dụng màu chữ
  const handleApplyColor = (color) => {
    execCmd('foreColor', color);
    setShowColorPicker(false);
  };

  // Áp dụng màu nền chữ (Highlight)
  const handleApplyHighlight = (color) => {
    if (color === 'transparent') {
      execCmd('removeFormat');
    } else {
      execCmd('hiliteColor', color);
    }
    setShowHighlightPicker(false);
  };

  // Thêm hộp ghi chú nổi bật (Callout Box)
  const handleInsertCallout = () => {
    restoreSelection();
    const calloutHtml = `
      <div class="callout-box" style="margin: 14px 0; padding: 14px 18px; background-color: #fef3c7; border-left: 4px solid #d97706; border-radius: 12px; color: #78350f; font-size: 14px; line-height: 1.6;">
        <strong style="color: #92400e; display: block; margin-bottom: 4px;">📌 Lưu ý quan trọng:</strong>
        <span>Nhập nội dung lưu ý, thể lệ áp dụng hoặc điều kiện đặc biệt tại đây...</span>
      </div>
      <p><br></p>
    `;
    document.execCommand('insertHTML', false, calloutHtml);
    handleEditorInput();
  };

  // Thêm đường kẻ ngang phân đoạn
  const handleInsertHr = () => {
    execCmd('insertHorizontalRule');
  };

  // Xử lý upload ảnh từ máy tính lên Supabase Storage
  const handleUploadImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP, GIF...).');
      return;
    }

    setIsUploadingImage(true);
    setUploadError('');

    try {
      const cdnUrl = await uploadImageToSupabase(file, 'promos');
      if (cdnUrl) {
        insertImageToContent(cdnUrl, file.name.replace(/\.[^.]+$/, ''));
        setIsUploadingImage(false);
        setShowImageModal(false);
        return;
      }
    } catch (err) {
      console.warn('Lỗi upload ảnh:', err);
    }

    // Fallback: Nén Base64 nếu Supabase gặp sự cố
    const reader = new FileReader();
    reader.onload = (ev) => {
      insertImageToContent(ev.target.result, file.name);
      setIsUploadingImage(false);
      setShowImageModal(false);
    };
    reader.readAsDataURL(file);
  };

  // Chèn ảnh vào văn bản với căn lề và độ rộng
  const insertImageToContent = (url, altText = '') => {
    if (!url) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();

    const alignStyle = imageAlign === 'center' 
      ? 'display: block; margin: 16px auto;' 
      : (imageAlign === 'right' ? 'float: right; margin: 8px 0 16px 16px;' : 'float: left; margin: 8px 16px 16px 0;');

    const widthStyle = `width: ${imageWidth}; max-width: 100%; border-radius: 16px; box-shadow: 0 10px 25px rgba(43,23,14,0.12); object-fit: cover;`;

    const imgHtml = `
      <div style="${imageAlign === 'center' ? 'text-align: center; clear: both;' : 'clear: both;'} margin: 16px 0;">
        <img src="${url}" alt="${altText || 'Hình ảnh minh họa'}" style="${alignStyle} ${widthStyle}" data-align="${imageAlign}" data-width="${imageWidth}" />
      </div>
      <p><br></p>
    `;

    document.execCommand('insertHTML', false, imgHtml);
    handleEditorInput();

    // Reset modal state
    setImageUrl('');
    setImageAlt('');
    setShowImageModal(false);
  };

  // Chèn Hyperlink
  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;
    restoreSelection();
    if (linkText.trim()) {
      const targetAttr = 'target="_blank" rel="noopener noreferrer"';
      const linkHtml = `<a href="${linkUrl.trim()}" ${targetAttr} style="color: #8c5932; text-decoration: underline; font-weight: 700;">${linkText.trim()}</a>`;
      document.execCommand('insertHTML', false, linkHtml);
    } else {
      execCmd('createLink', linkUrl.trim());
    }
    handleEditorInput();
    setLinkUrl('');
    setLinkText('');
    setShowLinkModal(false);
  };

  // Xóa ảnh đang được chọn
  const handleDeleteSelectedImg = () => {
    if (selectedImgEl) {
      selectedImgEl.parentElement?.remove() || selectedImgEl.remove();
      setSelectedImgEl(null);
      handleEditorInput();
    }
  };

  // Bắt sự kiện click vào ảnh trong khung soạn thảo để chỉnh nhanh
  const handleEditorClick = (e) => {
    if (e.target.tagName === 'IMG') {
      setSelectedImgEl(e.target);
    } else {
      setSelectedImgEl(null);
    }
  };

  // Đếm từ và ký tự
  const textContent = htmlSource.replace(/<[^>]*>/g, '').trim();
  const wordCount = textContent ? textContent.split(/\s+/).filter(Boolean).length : 0;
  const charCount = textContent.length;

  return (
    <div className={`rich-text-editor-wrapper bg-white rounded-2xl border border-[#dfd4c7] shadow-xs flex flex-col transition-all ${
      isFullscreen ? 'fixed inset-0 z-[999999] rounded-none border-0 shadow-2xl overflow-hidden' : ''
    }`}>
      
      {/* =========================================================================
          TOOLBAR SOẠN THẢO VĂN BẢN ĐẦY ĐỦ CÁC TÍNH NĂNG CHUYÊN NGHIỆP
          ========================================================================= */}
      <div className="bg-[#fcfaf7] border-b border-[#dfd4c7] p-2 sm:p-2.5 flex flex-wrap items-center gap-1.5 select-none shrink-0 sticky top-0 z-20">
        
        {/* NHÓM 1: UNDO / REDO */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-[#dfd4c7]/80">
          <button
            type="button"
            onClick={() => execCmd('undo')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title="Hoàn tác (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('redo')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title="Làm lại (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* NHÓM 2: TIÊU ĐỀ & ĐOẠN VĂN (H1, H2, H3, P) */}
        <div className="flex items-center gap-1 pr-1.5 border-r border-[#dfd4c7]/80">
          <select
            onChange={(e) => {
              if (e.target.value.startsWith('H')) {
                handleBlockFormat(e.target.value);
              } else if (e.target.value === 'P') {
                handleBlockFormat('P');
              } else if (e.target.value.endsWith('px')) {
                handleFontSize(e.target.value);
              }
              e.target.value = '';
            }}
            defaultValue=""
            className="px-2.5 py-1 rounded-lg bg-white border border-[#dfd4c7] text-xs font-bold text-[#2b170e] focus:outline-none cursor-pointer hover:border-[#8c5932] shadow-2xs"
            title="Định dạng tiêu đề & cỡ chữ"
          >
            <option value="" disabled>Kiểu chữ & Cỡ</option>
            <option value="H1">📌 Tiêu đề lớn (H1)</option>
            <option value="H2">🔸 Tiêu đề mục (H2)</option>
            <option value="H3">🔹 Tiêu đề phụ (H3)</option>
            <option value="P">📄 Đoạn văn thường</option>
            <option disabled>──────────</option>
            <option value="12px">Chữ nhỏ (12px)</option>
            <option value="14px">Chữ chuẩn (14px)</option>
            <option value="16px">Chữ vừa (16px)</option>
            <option value="18px">Chữ lớn (18px)</option>
            <option value="22px">Chữ rất lớn (22px)</option>
            <option value="26px">Chữ khổng lồ (26px)</option>
          </select>
        </div>

        {/* NHÓM 3: ĐỊNH DẠNG CƠ BẢN: ĐẬM, NGHIÊNG, GẠCH CHÂN, GẠCH NGANG */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-[#dfd4c7]/80">
          <button
            type="button"
            onClick={() => execCmd('bold')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer font-black"
            title="Chữ đậm (Ctrl+B)"
          >
            <Bold className="w-4 h-4 stroke-[2.8]" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('italic')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer italic"
            title="Chữ nghiêng (Ctrl+I)"
          >
            <Italic className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('underline')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer underline"
            title="Gạch chân (Ctrl+U)"
          >
            <Underline className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('strikeThrough')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer line-through"
            title="Gạch ngang chữ"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* NHÓM 4: MÀU CHỮ & HIGHLIGHT NỀN */}
        <div className="flex items-center gap-1 pr-1.5 border-r border-[#dfd4c7]/80 relative">
          {/* Nút Màu chữ */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                saveSelection();
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }}
              className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer flex items-center gap-0.5"
              title="Màu chữ văn bản"
            >
              <Palette className="w-4 h-4 text-amber-700" />
            </button>

            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1.5 p-2 bg-white rounded-xl shadow-xl border border-[#dfd4c7] z-50 grid grid-cols-3 gap-1.5 w-36">
                {TEXT_COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleApplyColor(c.value)}
                    className="w-7 h-7 rounded-lg border border-black/10 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-2xs"
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
                <div className="col-span-3 pt-1 border-t border-stone-200 flex items-center gap-1.5">
                  <span className="text-[10px] text-stone-500 font-bold">Tùy chọn:</span>
                  <input
                    type="color"
                    onChange={(e) => handleApplyColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                    title="Bảng màu tự do"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Nút Highlight nền chữ */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                saveSelection();
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }}
              className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer flex items-center gap-0.5"
              title="Tô sáng / Highlight nền chữ"
            >
              <Highlighter className="w-4 h-4 text-amber-600" />
            </button>

            {showHighlightPicker && (
              <div className="absolute top-full left-0 mt-1.5 p-2 bg-white rounded-xl shadow-xl border border-[#dfd4c7] z-50 grid grid-cols-3 gap-1.5 w-36">
                {HIGHLIGHT_COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleApplyHighlight(c.value)}
                    className="w-7 h-7 rounded-lg border border-black/10 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-2xs text-[10px] font-bold"
                    style={{ backgroundColor: c.value === 'transparent' ? '#f3f4f6' : c.value }}
                    title={c.name}
                  >
                    {c.value === 'transparent' && '✕'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* NHÓM 5: CĂN LỀ: TRÁI, GIỮA, PHẢI, ĐỀU 2 BÊN */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-[#dfd4c7]/80">
          <button
            type="button"
            onClick={() => execCmd('justifyLeft')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title="Căn lề trái"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyCenter')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title="Căn lề giữa"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyRight')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title="Căn lề phải"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyFull')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title="Căn đều 2 bên"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* NHÓM 6: THỤT LỀ (TỤT LỀ / LÙI LỀ) */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-[#dfd4c7]/80">
          <button
            type="button"
            onClick={() => execCmd('outdent')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title="Lùi lề ra ngoài (Giảm thụt lề)"
          >
            <Outdent className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('indent')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title="Tụt lề vào trong (Tăng thụt lề)"
          >
            <Indent className="w-4 h-4" />
          </button>
        </div>

        {/* NHÓM 7: DANH SÁCH (CHẤM TRÒN, SỐ THỨ TỰ), TRÍCH DẪN & ĐƯỜNG KẺ */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-[#dfd4c7]/80">
          <button
            type="button"
            onClick={() => execCmd('insertUnorderedList')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title="Danh sách gạch đầu dòng"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertOrderedList')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title="Danh sách số thứ tự 1, 2, 3..."
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('formatBlock', 'blockquote')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title="Khối trích dẫn phong cách"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleInsertCallout}
            className="p-1.5 rounded-lg text-amber-800 hover:bg-amber-100/80 transition-colors cursor-pointer font-bold text-xs flex items-center gap-1"
            title="Thêm hộp ghi chú / Tip nổi bật"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Hộp Lưu Ý</span>
          </button>
          <button
            type="button"
            onClick={handleInsertHr}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title="Chèn đường kẻ ngang phân đoạn"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* NHÓM 8: CHÈN ẢNH VÀ CHÈN LIÊN KẾT */}
        <div className="flex items-center gap-1 pr-1.5 border-r border-[#dfd4c7]/80">
          <button
            type="button"
            onClick={() => {
              saveSelection();
              setShowImageModal(true);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-[#8c5932] font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-amber-600/30 shadow-2xs active:scale-95"
            title="Chèn hình ảnh vào bài viết"
          >
            <ImageIcon className="w-4 h-4 text-amber-700" />
            <span>Chèn Ảnh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              saveSelection();
              setShowLinkModal(true);
            }}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title="Chèn liên kết (Hyperlink)"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCmd('unlink')}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title="Hủy liên kết"
          >
            <Unlink className="w-4 h-4" />
          </button>
        </div>

        {/* NHÓM 9: CHẾ ĐỘ XEM & TIỆN ÍCH (CODE HTML, PREVIEW, FULLSCREEN) */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Nút Xóa định dạng */}
          <button
            type="button"
            onClick={() => execCmd('removeFormat')}
            className="p-1.5 rounded-lg text-[#7a5843] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Xóa mọi định dạng font/màu về mặc định"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Toggle Chế độ Visual / Code / Preview */}
          <div className="inline-flex items-center bg-white border border-[#dfd4c7] p-0.5 rounded-xl shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('visual')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'visual' ? 'bg-[#2b170e] text-white shadow-xs' : 'text-stone-600 hover:text-black'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Soạn thảo</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'preview' ? 'bg-[#2b170e] text-white shadow-xs' : 'text-stone-600 hover:text-black'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem trước</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('code')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'code' ? 'bg-[#2b170e] text-white shadow-xs' : 'text-stone-600 hover:text-black'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>HTML</span>
            </button>
          </div>

          {/* Toàn màn hình */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-[#5c3d2e] hover:bg-white hover:text-black hover:shadow-2xs transition-colors cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-700" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* =========================================================================
          THANH ĐIỀU KHIỂN NHANH KHI CLICK VÀO ẢNH TRONG BÀI VIẾT
          ========================================================================= */}
      {selectedImgEl && (
        <div className="bg-amber-500/15 border-b border-amber-600/30 px-4 py-2 flex items-center justify-between gap-3 text-xs text-[#2b170e] animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="font-bold flex items-center gap-1">
              <ImageIcon className="w-4 h-4 text-amber-800" />
              Đang chọn ảnh:
            </span>
            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-[#dfd4c7]">
              <span className="text-stone-500">Cỡ ảnh:</span>
              <button
                type="button"
                onClick={() => {
                  selectedImgEl.style.width = '100%';
                  handleEditorInput();
                }}
                className="px-1.5 py-0.5 rounded hover:bg-amber-100 font-bold"
              >
                100%
              </button>
              <button
                type="button"
                onClick={() => {
                  selectedImgEl.style.width = '75%';
                  handleEditorInput();
                }}
                className="px-1.5 py-0.5 rounded hover:bg-amber-100 font-bold"
              >
                75%
              </button>
              <button
                type="button"
                onClick={() => {
                  selectedImgEl.style.width = '50%';
                  handleEditorInput();
                }}
                className="px-1.5 py-0.5 rounded hover:bg-amber-100 font-bold"
              >
                50%
              </button>
            </div>

            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-[#dfd4c7]">
              <span className="text-stone-500">Căn lề:</span>
              <button
                type="button"
                onClick={() => {
                  selectedImgEl.style.display = 'block';
                  selectedImgEl.style.margin = '16px auto';
                  selectedImgEl.style.float = 'none';
                  handleEditorInput();
                }}
                className="px-1.5 py-0.5 rounded hover:bg-amber-100 font-bold"
              >
                Giữa
              </button>
              <button
                type="button"
                onClick={() => {
                  selectedImgEl.style.float = 'left';
                  selectedImgEl.style.margin = '8px 16px 16px 0';
                  handleEditorInput();
                }}
                className="px-1.5 py-0.5 rounded hover:bg-amber-100 font-bold"
              >
                Trái
              </button>
              <button
                type="button"
                onClick={() => {
                  selectedImgEl.style.float = 'right';
                  selectedImgEl.style.margin = '8px 0 16px 16px';
                  handleEditorInput();
                }}
                className="px-1.5 py-0.5 rounded hover:bg-amber-100 font-bold"
              >
                Phải
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDeleteSelectedImg}
            className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-rose-700 cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa ảnh</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          KHUNG VÙNG NỘI DUNG SOẠN THẢO CHÍNH
          ========================================================================= */}
      <div 
        className="flex-1 overflow-y-auto relative p-4 sm:p-6"
        style={{ 
          minHeight: isFullscreen ? 'calc(100vh - 120px)' : minHeight,
          maxHeight: isFullscreen ? 'calc(100vh - 120px)' : maxHeight
        }}
      >
        
        {/* CHẾ ĐỘ 1: SOẠN THẢO TRỰC QUAN (VISUAL WYSIWYG) */}
        {viewMode === 'visual' && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            onBlur={handleEditorInput}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            onClick={handleEditorClick}
            data-placeholder={placeholder}
            className="rich-text-content outline-none focus:outline-none min-h-full leading-relaxed text-[#2b170e] text-sm select-text"
            style={{
              fontFamily: 'inherit',
              wordBreak: 'break-word',
              tabSize: 4
            }}
          />
        )}

        {/* CHẾ ĐỘ 2: MÃ NGUỒN HTML (SOURCE CODE VIEW) */}
        {viewMode === 'code' && (
          <div className="h-full flex flex-col space-y-2">
            <div className="text-[11px] font-bold text-stone-500 uppercase flex items-center gap-1">
              <Code className="w-3.5 h-3.5 text-amber-700" />
              <span>Chỉnh sửa trực tiếp mã HTML:</span>
            </div>
            <textarea
              value={htmlSource}
              onChange={(e) => handleSourceChange(e.target.value)}
              placeholder="Nhập mã HTML..."
              className="w-full flex-1 min-h-[240px] p-4 rounded-xl bg-stone-900 text-amber-200 font-mono text-xs sm:text-sm leading-relaxed border border-stone-800 focus:outline-none focus:border-amber-500 resize-none shadow-inner"
            />
          </div>
        )}

        {/* CHẾ ĐỘ 3: XEM TRƯỚC BÀI VIẾT THỰC TẾ (LIVE PREVIEW) */}
        {viewMode === 'preview' && (
          <div className="space-y-4">
            <div className="text-[11px] font-bold text-emerald-700 uppercase flex items-center gap-1.5 pb-2 border-b border-stone-200">
              <Eye className="w-4 h-4" />
              <span>Bản xem trước bài viết khi hiển thị ngoài trang web:</span>
            </div>
            {htmlSource ? (
              <div 
                className="rich-text-content leading-relaxed text-[#2b170e] text-sm sm:text-base space-y-3"
                dangerouslySetInnerHTML={{ __html: htmlSource }}
              />
            ) : (
              <div className="text-center py-10 text-stone-400 italic text-sm">
                (Chưa có nội dung bài viết để xem trước)
              </div>
            )}
          </div>
        )}

      </div>

      {/* =========================================================================
          FOOTER ĐẾM TỪ & KÝ TỰ VÀ HƯỚNG DẪN NHANH
          ========================================================================= */}
      <div className="bg-[#fcfaf7] border-t border-[#dfd4c7] px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#7a5843] shrink-0">
        <div className="flex items-center gap-3">
          <span>💡 Phím tắt: <strong>Ctrl+B</strong> (Đậm), <strong>Ctrl+I</strong> (Nghiêng), <strong>Ctrl+U</strong> (Gạch chân)</span>
        </div>
        <div className="flex items-center gap-3 font-semibold">
          <span>{wordCount} từ</span>
          <span>•</span>
          <span>{charCount} ký tự</span>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: CHÈN ẢNH VÀO BÀI VIẾT (TẢI TỪ MÁY / LINK URL)
          ========================================================================= */}
      {showImageModal && (
        <div 
          className="fixed inset-0 z-[9999999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowImageModal(false)}
        >
          <div 
            className="bg-white rounded-[28px] max-w-lg w-full p-6 space-y-5 shadow-2xl border border-stone-200 relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-[#2b170e]">Chèn Ảnh Vào Bài Viết</h3>
                  <p className="text-xs text-stone-500">Tự động nén WebP siêu nhẹ & lưu trữ vĩnh viễn trên Supabase</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            {/* Tab Chọn: Tải từ máy vs Nhập Link URL */}
            <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setImageTab('upload')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  imageTab === 'upload' ? 'bg-white text-[#2b170e] shadow-xs' : 'text-stone-600 hover:text-black'
                }`}
              >
                Tải ảnh từ máy tính
              </button>
              <button
                type="button"
                onClick={() => setImageTab('url')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  imageTab === 'url' ? 'bg-white text-[#2b170e] shadow-xs' : 'text-stone-600 hover:text-black'
                }`}
              >
                Nhập đường dẫn ảnh (URL)
              </button>
            </div>

            {/* Cấu hình hiển thị ảnh: Căn lề & Kích thước */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
              <div>
                <label className="font-bold text-[#2b170e] block mb-1">Căn lề hiển thị:</label>
                <select
                  value={imageAlign}
                  onChange={(e) => setImageAlign(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 font-semibold text-[#2b170e] focus:outline-none cursor-pointer"
                >
                  <option value="center">Ở giữa bài viết (Center)</option>
                  <option value="left">Nằm bên trái (Left align)</option>
                  <option value="right">Nằm bên phải (Right align)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#2b170e] block mb-1">Độ rộng ảnh:</label>
                <select
                  value={imageWidth}
                  onChange={(e) => setImageWidth(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 font-semibold text-[#2b170e] focus:outline-none cursor-pointer"
                >
                  <option value="100%">Tràn 100% chiều rộng</option>
                  <option value="75%">Vừa phải (75%)</option>
                  <option value="50%">Nhỏ gọn (50%)</option>
                </select>
              </div>
            </div>

            {/* TAB 1: TẢI FILE ẢNH TỪ MÁY */}
            {imageTab === 'upload' && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleUploadImageFile}
                  className="hidden"
                />

                <div 
                  onClick={() => !isUploadingImage && fileInputRef.current?.click()}
                  className="p-8 rounded-2xl border-2 border-dashed border-stone-300 hover:border-amber-600 bg-stone-50/60 hover:bg-amber-50/30 transition-all flex flex-col items-center justify-center text-center cursor-pointer space-y-2 group"
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-10 h-10 animate-spin text-amber-700" />
                      <span className="text-sm font-bold text-amber-900">Đang tối ưu WebP & tải lên Supabase...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                        <Upload className="w-6 h-6 text-amber-700" />
                      </div>
                      <span className="text-sm font-bold text-[#2b170e]">Nhấn vào đây để chọn ảnh từ máy</span>
                      <span className="text-xs text-stone-400">Hỗ trợ JPG, PNG, WEBP, GIF (Tối đa 15MB)</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: NHẬP LINK URL ẢNH */}
            {imageTab === 'url' && (
              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-[#2b170e] block mb-1">
                    Đường dẫn URL ảnh:
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/hinh-anh.jpg"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#2b170e] focus:outline-none focus:border-[#2b170e] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2b170e] block mb-1">
                    Chú thích ảnh (Alt text):
                  </label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="VD: Cà phê phin truyền thống Coffee 2424"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#2b170e] focus:outline-none focus:border-[#2b170e] focus:bg-white"
                  />
                </div>

                {imageUrl && (
                  <div className="p-2 rounded-xl bg-stone-100 max-h-40 overflow-hidden flex items-center justify-center">
                    <img src={imageUrl} alt="Xem trước" className="max-h-36 rounded-lg object-contain" />
                  </div>
                )}

                <button
                  type="button"
                  disabled={!imageUrl.trim()}
                  onClick={() => insertImageToContent(imageUrl.trim(), imageAlt.trim())}
                  className="w-full py-3 rounded-xl bg-[#2b170e] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>XÁC NHẬN CHÈN ẢNH NÀY</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CHÈN LIÊN KẾT (HYPERLINK)
          ========================================================================= */}
      {showLinkModal && (
        <div 
          className="fixed inset-0 z-[9999999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowLinkModal(false)}
        >
          <div 
            className="bg-white rounded-[28px] max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200 relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-black text-lg text-[#2b170e] flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-amber-700" />
                <span>Chèn Liên Kết Vào Bài Viết</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#2b170e] block mb-1">
                  Đoạn chữ hiển thị (Text):
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="VD: Đặt món online tại đây..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#2b170e] focus:outline-none focus:border-[#2b170e]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#2b170e] block mb-1">
                  Đường dẫn liên kết (URL):
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://coffee2424.com/dathang hoặc /dathang"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-[#2b170e] focus:outline-none focus:border-[#2b170e]"
                />
              </div>

              <button
                type="button"
                disabled={!linkUrl.trim()}
                onClick={handleInsertLink}
                className="w-full py-3 rounded-xl bg-[#2b170e] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>XÁC NHẬN CHÈN LIÊN KẾT</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
