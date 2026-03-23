import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, Upload, Scissors, RotateCw, Type, Smile, Download, Plus, Trash2, Send, Wand2, ZoomIn, ZoomOut, Image as ImageIcon, Package, Check, Eraser, MousePointer2, Undo2, Redo2, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Transformer, Group, Line } from 'react-konva';
import useImage from 'use-image';
import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react';

interface Overlay {
  id: string;
  type: 'text' | 'emoji' | 'image';
  content?: string;
  src?: string;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  color?: string;
  fontFamily?: string;
  fontStyle?: string;
}

interface LineData {
  points: number[];
  brushSize: number;
  globalCompositeOperation: 'source-over' | 'destination-out';
}

interface HistoryState {
  elements: Overlay[];
  lines: LineData[];
}

const URLImage = ({ image, shapeProps, isSelected, onSelect, onChange }: any) => {
  const [img] = useImage(image.src, 'anonymous');
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <KonvaImage
        image={img}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            scaleX: shapeProps.scaleX * scaleX,
            scaleY: shapeProps.scaleY * scaleY,
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const TextOverlay = ({ shapeProps, isSelected, onSelect, onChange }: any) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <KonvaText
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        text={shapeProps.content}
        fontSize={shapeProps.type === 'emoji' ? 80 : 60}
        fill={shapeProps.color || '#FFFFFF'}
        fontFamily={shapeProps.fontFamily || 'Arial'}
        fontStyle={shapeProps.fontStyle || 'normal'}
        stroke={shapeProps.type === 'text' ? '#000000' : undefined}
        strokeWidth={shapeProps.type === 'text' ? 2 : 0}
        draggable
        onDragEnd={(e) => {
          onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            scaleX: shapeProps.scaleX * scaleX,
            scaleY: shapeProps.scaleY * scaleY,
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export function StickerTools({ onAction }: { onAction: () => void }) {
  const [view, setView] = useState<'pack' | 'editor'>('pack');
  const [pack, setPack] = useState<string[]>([]);
  const [packName, setPackName] = useState('My Stickers');
  const [toast, setToast] = useState('');

  // Editor State
  const [elements, setElements] = useState<Overlay[]>([]);
  const [selectedId, selectShape] = useState<string | null>(null);
  const [showTextPrompt, setShowTextPrompt] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textFont, setTextFont] = useState('Arial');
  const [textStyle, setTextStyle] = useState('normal');
  const [showEmojiPrompt, setShowEmojiPrompt] = useState(false);
  
  // Undo/Redo State
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  
  // Eraser State
  const [isErasing, setIsErasing] = useState(false);
  const [lines, setLines] = useState<LineData[]>([]);
  const [brushSize, setBrushSize] = useState(20);
  const [eraserMode, setEraserMode] = useState<'erase' | 'restore'>('erase');
  const isDrawing = useRef(false);

  const stageRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const saveHistory = useCallback((newElements: Overlay[], newLines: LineData[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push({ elements: newElements, lines: newLines });
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  }, [history, historyStep]);

  const handleUndo = () => {
    if (historyStep <= 0) return;
    const prevStep = historyStep - 1;
    setElements(history[prevStep].elements);
    setLines(history[prevStep].lines);
    setHistoryStep(prevStep);
    selectShape(null);
  };

  const handleRedo = () => {
    if (historyStep >= history.length - 1) return;
    const nextStep = historyStep + 1;
    setElements(history[nextStep].elements);
    setLines(history[nextStep].lines);
    setHistoryStep(nextStep);
    selectShape(null);
  };

  const updateElements = (newElements: Overlay[]) => {
    setElements(newElements);
    saveHistory(newElements, lines);
  };

  const updateLines = (newLines: LineData[]) => {
    setLines(newLines);
    saveHistory(elements, newLines);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(400 / img.width, 400 / img.height);
          const newElements = [{
            id: Date.now().toString(),
            type: 'image' as const,
            src: src,
            x: 256 - (img.width * scale) / 2,
            y: 256 - (img.height * scale) / 2,
            scaleX: scale,
            scaleY: scale,
            rotation: 0
          }];
          setElements(newElements);
          setLines([]);
          setHistory([{ elements: newElements, lines: [] }]);
          setHistoryStep(0);
          setIsErasing(false);
          setView('editor');
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  const [isRemovingBg, setIsRemovingBg] = useState(false);

  const removeBackground = async () => {
    const mainImage = elements.find(e => e.type === 'image');
    if (!mainImage || !mainImage.src) {
      showToast('Please upload an image first.');
      return;
    }

    setIsRemovingBg(true);
    showToast('Removing background... This may take a moment.');

    try {
      const blob = await imglyRemoveBackground(mainImage.src);
      const url = URL.createObjectURL(blob);
      
      const newElements = elements.map(e => {
        if (e.id === mainImage.id) {
          return { ...e, src: url };
        }
        return e;
      });
      updateElements(newElements);
      
      showToast('Background removed successfully!');
    } catch (error) {
      console.error('Error removing background:', error);
      showToast('Failed to remove background. Try manual eraser.');
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleAddText = () => {
    if (!textInput) return;
    const newElements = [...elements, { 
      id: Date.now().toString(), 
      type: 'text' as const, 
      content: textInput, 
      x: 150, y: 200, 
      scaleX: 1, scaleY: 1, rotation: 0, 
      color: textColor,
      fontFamily: textFont,
      fontStyle: textStyle
    }];
    updateElements(newElements);
    setTextInput('');
    setShowTextPrompt(false);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const newElements = [...elements, { 
      id: Date.now().toString(), 
      type: 'emoji' as const, 
      content: emojiData.emoji, 
      x: 200, y: 200, 
      scaleX: 1, scaleY: 1, rotation: 0 
    }];
    updateElements(newElements);
    setShowEmojiPrompt(false);
  };

  const handleConvert = () => {
    if (!stageRef.current) return;
    selectShape(null); // Deselect to hide transformer
    setTimeout(() => {
      const webpUrl = stageRef.current.toDataURL({ mimeType: 'image/webp', quality: 0.8, pixelRatio: 1 });
      setPack([...pack, webpUrl]);
      setView('pack');
      setElements([]);
      setLines([]);
      setHistory([]);
      setHistoryStep(-1);
      showToast('Sticker added to pack!');
      onAction();
    }, 100);
  };

  const handleSaveToDevice = () => {
    if (!stageRef.current) return;
    selectShape(null);
    setTimeout(() => {
      const webpUrl = stageRef.current.toDataURL({ mimeType: 'image/webp', quality: 0.8, pixelRatio: 1 });
      const a = document.createElement('a');
      a.href = webpUrl;
      a.download = `QuickChat_Sticker_${Date.now()}.webp`;
      a.click();
      showToast('Saved to device as WebP');
      onAction();
    }, 100);
  };

  const handleExportPack = () => {
    if (pack.length === 0) {
      showToast('Add at least 1 sticker to export.');
      return;
    }
    
    // Create a simple JSON representation for WhatsApp sticker pack format
    const packData = {
      identifier: `quickchat_pack_${Date.now()}`,
      name: packName,
      publisher: "QuickChat",
      tray_image_file: pack[0], // Use first sticker as tray image
      image_data_version: "1",
      avoid_cache: false,
      stickers: pack.map((stickerUrl, idx) => ({
        image_file: stickerUrl,
        emojis: ["😀"] // Default emoji
      }))
    };

    const blob = new Blob([JSON.stringify(packData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${packName.replace(/\s+/g, '_').toLowerCase()}.wastickers`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Sticker pack exported!');
  };

  const handleAddToWhatsApp = () => {
    if (pack.length < 3) {
      showToast('Add at least 3 stickers to add directly to WhatsApp.');
      return;
    }
    // @ts-ignore
    if (window.Android && window.Android.addStickerPackToWhatsApp) {
      // @ts-ignore
      window.Android.addStickerPackToWhatsApp(packName, JSON.stringify(pack));
    } else {
      showToast('WhatsApp integration not available. Use Export instead.');
    }
    onAction();
  };

  const removeStickerFromPack = (index: number) => {
    const newPack = [...pack];
    newPack.splice(index, 1);
    setPack(newPack);
  };

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleMouseDown = (e: any) => {
    if (!isErasing) {
      checkDeselect(e);
      return;
    }
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { 
      points: [pos.x, pos.y], 
      brushSize, 
      globalCompositeOperation: eraserMode === 'erase' ? 'destination-out' : 'source-over' 
    }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isErasing || !isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    if (isDrawing.current) {
      isDrawing.current = false;
      saveHistory(elements, lines);
    }
  };

  return (
    <div className="p-4 space-y-6 relative h-full flex flex-col">
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50 animate-in fade-in slide-in-from-bottom-4 whitespace-nowrap">
          {toast}
        </div>
      )}

      {view === 'pack' ? (
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-[#1E293B] rounded-[20px] p-5 shadow-sm border border-transparent dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
                <Package size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sticker Creator</h2>
                <p className="text-xs text-gray-500">{pack.length} stickers in pack</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-5 shadow-sm border border-transparent dark:border-gray-800 flex-1 flex flex-col">
            <input
              type="text"
              value={packName}
              onChange={(e) => setPackName(e.target.value)}
              className="w-full bg-[#F5F6F8] dark:bg-[#0F172A] border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#25D366] outline-none transition-all font-bold text-lg mb-4 text-center"
              placeholder="Pack Name"
            />

            <div className="grid grid-cols-3 gap-3 mb-4 overflow-y-auto flex-1 content-start min-h-[200px]">
              {pack.map((sticker, idx) => (
                <div key={idx} className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center group">
                  <img src={sticker} alt={`Sticker ${idx}`} className="w-full h-full object-contain p-2" />
                  <button 
                    onClick={() => removeStickerFromPack(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              
              <label className="aspect-square bg-[#F5F6F8] dark:bg-[#0F172A] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                <Plus size={24} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-500 font-medium">Add Sticker</span>
                <input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            <button
              onClick={handleAddToWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-[16px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#25D366]/20 mt-auto"
            >
              <Send size={20} />
              Add to WhatsApp
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-4">
          <div className="flex items-center gap-3 bg-white dark:bg-[#1E293B] rounded-[20px] p-4 shadow-sm border border-transparent dark:border-gray-800">
            <button onClick={() => setView('pack')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-600 dark:text-gray-300">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Sticker</h2>
          </div>

          <div className="bg-white dark:bg-[#1E293B] rounded-[20px] p-4 shadow-sm border border-transparent dark:border-gray-800 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
            <div 
              className="w-full max-w-[350px] aspect-square rounded-xl overflow-hidden shadow-inner relative border border-gray-200 dark:border-gray-700 bg-transparent"
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%, #e5e7eb), repeating-linear-gradient(45deg, #e5e7eb 25%, #f3f4f6 25%, #f3f4f6 75%, #e5e7eb 75%, #e5e7eb)',
                backgroundPosition: '0 0, 10px 10px',
                backgroundSize: '20px 20px'
              }}
            >
              <Stage 
                width={512} 
                height={512} 
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                ref={stageRef}
                style={{ transform: 'scale(0.6835)', transformOrigin: 'top left' }} // Scale down 512 to fit ~350px container
              >
                <Layer>
                  {/* Grid Lines */}
                  <Line points={[256, 0, 256, 512]} stroke="rgba(0,0,0,0.1)" strokeWidth={1} dash={[5, 5]} />
                  <Line points={[0, 256, 512, 256]} stroke="rgba(0,0,0,0.1)" strokeWidth={1} dash={[5, 5]} />
                  
                  <Group>
                    {elements.map((el, i) => {
                      if (el.type === 'image') {
                        return (
                          <URLImage
                            key={el.id}
                            image={el}
                            shapeProps={el}
                            isSelected={el.id === selectedId && !isErasing}
                            onSelect={() => { if (!isErasing) selectShape(el.id); }}
                            onChange={(newAttrs: any) => {
                              const els = elements.slice();
                              els[i] = newAttrs;
                              updateElements(els);
                            }}
                          />
                        );
                      }
                      return (
                        <TextOverlay
                          key={el.id}
                          shapeProps={el}
                          isSelected={el.id === selectedId && !isErasing}
                          onSelect={() => { if (!isErasing) selectShape(el.id); }}
                          onChange={(newAttrs: any) => {
                            const els = elements.slice();
                            els[i] = newAttrs;
                            updateElements(els);
                          }}
                        />
                      );
                    })}
                    {/* Eraser Lines */}
                    {lines.map((line, i) => (
                      <Line
                        key={i}
                        points={line.points}
                        stroke="#df4b26"
                        strokeWidth={line.brushSize}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation={line.globalCompositeOperation}
                      />
                    ))}
                  </Group>
                </Layer>
              </Stage>
            </div>

            {/* Eraser Controls */}
            {isErasing && (
              <div className="w-full max-w-[350px] mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Brush Size: {brushSize}px</span>
                  <input 
                    type="range" 
                    min="5" 
                    max="100" 
                    value={brushSize} 
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-32 accent-[#25D366]"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEraserMode('erase')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${eraserMode === 'erase' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
                  >
                    Erase
                  </button>
                  <button 
                    onClick={() => setEraserMode('restore')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${eraserMode === 'restore' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
                  >
                    Restore
                  </button>
                </div>
              </div>
            )}

            {/* Editor Toolbar */}
            <div className="flex flex-wrap justify-center gap-2 mt-4 w-full">
              <button 
                onClick={() => {
                  setIsErasing(!isErasing);
                  selectShape(null);
                }} 
                className={`flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl transition-colors ${isErasing ? 'bg-[#25D366]/10 text-[#25D366]' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
              >
                {isErasing ? <MousePointer2 size={20} /> : <Eraser size={20} />}
                <span className="text-[10px] font-medium">{isErasing ? 'Move' : 'Erase'}</span>
              </button>
              <button 
                onClick={removeBackground} 
                disabled={isRemovingBg}
                className={`flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl transition-colors ${isRemovingBg ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'} text-gray-700 dark:text-gray-300`}
              >
                {isRemovingBg ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Wand2 size={20} />
                )}
                <span className="text-[10px] font-medium">Auto BG</span>
              </button>
              <button onClick={() => setShowTextPrompt(true)} className="flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
                <Type size={20} />
                <span className="text-[10px] font-medium">Text</span>
              </button>
              <button onClick={() => setShowEmojiPrompt(true)} className="flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
                <Smile size={20} />
                <span className="text-[10px] font-medium">Emoji</span>
              </button>
              <button 
                onClick={() => {
                  if (selectedId) {
                    setElements(elements.filter(e => e.id !== selectedId));
                    selectShape(null);
                  }
                }} 
                className={`flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-xl transition-colors ${selectedId ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-gray-400 opacity-50 cursor-not-allowed'}`}
                disabled={!selectedId}
              >
                <Trash2 size={20} />
                <span className="text-[10px] font-medium">Delete</span>
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveToDevice}
              className="flex-1 bg-[#F5F6F8] dark:bg-[#1E293B] hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold py-4 rounded-[16px] flex items-center justify-center gap-2 transition-colors border border-gray-200 dark:border-gray-700"
            >
              <Download size={20} />
              Save
            </button>
            <button
              onClick={handleConvert}
              className="flex-[2] bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-[16px] flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#25D366]/20"
            >
              <Check size={20} />
              Convert
            </button>
          </div>
        </div>
      )}

      {/* Text Prompt Modal */}
      {showTextPrompt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-[24px] w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Text</h3>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full bg-[#F5F6F8] dark:bg-[#0F172A] border-none rounded-[14px] py-3 px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#25D366] outline-none mb-4"
              placeholder="Enter text..."
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setShowTextPrompt(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 dark:bg-gray-800">Cancel</button>
              <button onClick={handleAddText} className="flex-1 py-3 rounded-xl font-bold text-white bg-[#25D366]">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Emoji Prompt Modal */}
      {showEmojiPrompt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-[24px] w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95 flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Emoji</h3>
              <button onClick={() => setShowEmojiPrompt(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        </div>
      )}
    </div>
  );
}

