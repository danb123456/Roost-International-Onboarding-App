
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Flame, 
  Utensils, 
  Wrench, 
  Users, 
  Plane, 
  ClipboardList,
  Save,
  Loader2,
  Info,
  Camera,
  MapPin,
  Calendar,
  Contact,
  ChevronRight,
  ChefHat,
  Hotel,
  Heart,
  X
} from 'lucide-react';
import { OnboardingData, Step, MenuEntry, EquipmentEntry, FuelEntry, StaffMember, ProcessEntry } from './types.ts';
import { ROOSTLogo, MEAT_OPTIONS, FUEL_OPTIONS, EQUIPMENT_TEMPLATES, REQUIREMENT_TAGS, STAFF_ROLES } from './constants.tsx';
import { VisualSelector } from './components/VisualSelector.tsx';

const generateId = () => Math.random().toString(36).substr(2, 9);

const INITIAL_DATA: OnboardingData = {
  teamName: '',
  needsSupplementaryStaff: false,
  supplementaryStaffQty: 1,
  menu: [],
  kitchen: {
    needsKitchen: false,
    purpose: '',
    specificEquipment: '',
    photos: []
  },
  equipment: [],
  fuel: [],
  process: [],
  staff: [],
  flights: {
    outboundAirport: '',
    outboundDate: '',
    usArrivalAirport: '',
    inboundDate: '',
  },
  hotel: {
    numRooms: '',
    roomSpec: '',
    checkIn: '',
    checkOut: '',
    photos: []
  }
};

const STEPS: { id: Step; label: string; icon: any }[] = [
  { id: 'intro', label: 'Welcome', icon: ClipboardList },
  { id: 'info', label: 'Info', icon: Info },
  { id: 'menu', label: 'Menu', icon: Utensils },
  { id: 'kitchen', label: 'Kitchen', icon: ChefHat },
  { id: 'equipment', label: 'Gear', icon: Wrench },
  { id: 'fuel', label: 'Fuel', icon: Flame },
  { id: 'process', label: 'Timeline', icon: Calendar },
  { id: 'staff', label: 'Crew', icon: Users },
  { id: 'flights', label: 'Travel', icon: Plane },
  { id: 'hotel', label: 'Stay', icon: Hotel },
  { id: 'review', label: 'Review', icon: CheckCircle2 },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('fume_onboarding_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fume_onboarding_data', JSON.stringify(data));
  }, [data]);

  const goToNext = () => {
    const currentIndex = STEPS.findIndex(s => s.id === currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrev = () => {
    const currentIndex = STEPS.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (stepId: Step) => {
    if (data.teamName || stepId === 'intro') {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateFlights = (field: keyof typeof data.flights, value: any) => {
    setData(prev => ({
      ...prev,
      flights: { ...prev.flights, [field]: value }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // REPLACE the URL below with your actual deployed Apps Script URL
      const scriptUrl = 'https://script.google.com/macros/s/AKfycbzklC1zug0Cz5RPMdl2EWzLtNxk3VbDaDRpaca-sbEXXynK8Bla3_Z874_MglPcBno87g/exec';
      
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Critical for cross-origin Apps Script requests
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      setSubmitted(true);
      localStorage.removeItem('fume_onboarding_data');
    } catch (err) {
      console.error('Submission error:', err);
      alert("Submission failed. Please check your internet connection and ensure your Apps Script is deployed correctly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgress = () => {
    const activeIndex = STEPS.findIndex(s => s.id === currentStep);
    return (
      <div className="flex items-center justify-between mb-16 px-2 overflow-x-auto pb-6 no-scrollbar">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isPast = idx < activeIndex;
          return (
            <button 
              key={step.id} 
              onClick={() => handleStepClick(step.id)}
              className="flex flex-col items-center min-w-[70px] relative transition-transform hover:scale-105 group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border ${
                isActive ? 'bg-black text-white border-black scale-110 shadow-lg' : 
                isPast ? 'bg-zinc-100 text-black border-zinc-200' : 'bg-white text-zinc-200 border-zinc-100'
              }`}>
                <Icon size={18} />
              </div>
              <span className={`text-[8px] mt-3 font-black uppercase tracking-widest ${isActive ? 'text-black' : 'text-zinc-400 group-hover:text-black'}`}>
                {step.label}
              </span>
              {idx < STEPS.length - 1 && (
                <div className={`hidden md:block absolute top-6 -right-[40%] w-[60%] h-[1px] ${isPast ? 'bg-black/20' : 'bg-zinc-100'}`}></div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  const renderIntro = () => (
    <div className="text-center space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="py-8">
        <ROOSTLogo />
      </div>
      
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
          <Heart size={14} fill="currentColor" /> Premium Guest Status
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] text-black">
          Welcome to ROOST!
        </h2>
        
        <div className="space-y-6 text-zinc-500 text-lg leading-relaxed">
          <p>
            It is an absolute privilege to have you join us at ROOST: The Chicken Festival 2026. 
            We are beyond excited to see you bring your craft to London.
          </p>
          <p className="text-sm uppercase font-black tracking-widest text-black/40">
            This portal is designed to make your journey as effortless as possible.
          </p>
        </div>
        
        <div className="pt-8 space-y-4">
          <label className="block text-center text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em]">Chicken Master Brand / Team Name</label>
          <input 
            className="w-full bg-zinc-50 border border-zinc-200 rounded-3xl p-8 text-3xl focus:border-black outline-none transition-all placeholder:text-zinc-500 text-center uppercase tracking-widest font-black text-black"
            placeholder="BRAND NAME"
            value={data.teamName}
            onChange={e => setData({...data, teamName: e.target.value})}
          />
        </div>
      </div>
      
      <button 
        disabled={!data.teamName}
        onClick={goToNext}
        className="bg-black hover:bg-zinc-800 text-white font-black uppercase italic px-16 py-8 rounded-full flex items-center gap-4 mx-auto transition-all active:scale-95 disabled:opacity-20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-lg"
      >
        LET'S GET STARTED <ArrowRight size={24} strokeWidth={3} />
      </button>
    </div>
  );

  const renderInfoPage = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-black">ROOST 2026</h2>
        <p className="text-zinc-400 text-xs uppercase tracking-[0.4em] mt-2">Twickenham Stadium, London</p>
      </div>

      <div className="grid gap-8">
        <div className="fume-card p-10 rounded-[2.5rem] space-y-10 shadow-sm border border-zinc-100">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex gap-6 items-start">
              <div className="p-4 bg-zinc-100 rounded-2xl">
                  <MapPin className="text-black" size={24} />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Venue</p>
                <p className="text-xl font-black text-black">Allianz Stadium, Twickenham</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="p-4 bg-zinc-100 rounded-2xl">
                  <Calendar className="text-black" size={24} />
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Event Dates</p>
                <p className="text-xl font-black italic text-black">August 20 — 23, 2026</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-zinc-950 text-white rounded-3xl space-y-4 shadow-xl">
            <h4 className="font-black uppercase flex items-center gap-2 text-sm tracking-widest">
              <Users size={18} /> Attendance
            </h4>
            <p className="text-sm leading-relaxed opacity-80">
              We anticipate 5,000 guests daily (Thu-Sat) and 3,500 on Sunday. Prep accordingly for high-volume service.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center justify-between pt-8 border-t border-zinc-100">
            <div className="flex items-center gap-3">
              <Contact className="text-zinc-300" size={20} />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Support Contacts</span>
                <span className="text-xs font-bold text-black">dan@savourfestival.com • alex@savourfestival.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-zinc-100 pb-8">
        <div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter text-black">The Dishes</h2>
          <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] mt-2">What's on the menu?</p>
        </div>
        <button 
          onClick={() => {
            const newItem: MenuEntry = {
              id: generateId(),
              dishName: '',
              description: '',
              meatType: 'Whole Chicken',
              meatSpec: '',
              weightPerCut: '',
              dailyPortionTarget: '',
              meatDate: '',
              otherIngredients: [],
              otherDate: '',
            };
            setData({ ...data, menu: [...data.menu, newItem] });
          }}
          className="bg-black text-white px-8 py-4 rounded-full flex items-center gap-3 font-black uppercase text-[10px] tracking-widest"
        >
          <Plus size={16} /> Add Dish
        </button>
      </div>

      <div className="space-y-12">
        {data.menu.map((item, index) => (
          <div key={item.id} className="fume-card p-12 rounded-[3.5rem] space-y-12 relative bg-white border border-zinc-100 shadow-sm">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-black text-white flex items-center justify-center rounded-full font-black italic shadow-lg">
              {index + 1}
            </div>
            
            <div className="flex justify-between items-start gap-4">
              <input 
                className="w-full bg-transparent border-b border-zinc-100 focus:border-black outline-none text-4xl font-black p-2 uppercase tracking-tighter placeholder:text-zinc-600 text-black"
                placeholder="DISH NAME"
                value={item.dishName}
                onChange={e => {
                  const copy = [...data.menu];
                  copy[index].dishName = e.target.value;
                  setData({...data, menu: copy});
                }}
              />
              <button 
                onClick={() => setData({...data, menu: data.menu.filter(m => m.id !== item.id)})}
                className="text-zinc-200 hover:text-black p-2"
              >
                <Trash2 size={24} />
              </button>
            </div>

            <VisualSelector 
              label="Primary Protein"
              options={MEAT_OPTIONS} 
              selected={item.meatType} 
              onSelect={val => {
                const copy = [...data.menu];
                copy[index].meatType = val;
                setData({...data, menu: copy});
              }}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 p-10 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-tight">How many portions do you think you can make per day?</label>
                <input 
                  className="w-full bg-transparent border-b border-zinc-200 text-black p-2 text-xl font-black focus:border-black outline-none"
                  placeholder="e.g. 500"
                  value={item.dailyPortionTarget}
                  onChange={e => {
                    const copy = [...data.menu];
                    copy[index].dailyPortionTarget = e.target.value;
                    setData({...data, menu: copy});
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Meat Specification</label>
                <input className="w-full bg-transparent border-b border-zinc-200 text-black p-2 text-sm focus:border-black outline-none" placeholder="e.g. Corn-fed Free Range" value={item.meatSpec} onChange={e => {
                  const copy = [...data.menu]; copy[index].meatSpec = e.target.value; setData({...data, menu: copy});
                }} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Total weight for portion requirements</label>
                <input className="w-full bg-transparent border-b border-zinc-200 text-black p-2 text-sm focus:border-black outline-none" placeholder="e.g. 140lbs" value={item.weightPerCut} onChange={e => {
                  const copy = [...data.menu]; copy[index].weightPerCut = e.target.value; setData({...data, menu: copy});
                }} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Sides & Extra Ingredients</h4>
                <button 
                  onClick={() => {
                    const copy = [...data.menu];
                    copy[index].otherIngredients.push({ id: generateId(), name: '', qty: '' });
                    setData({...data, menu: copy});
                  }}
                  className="text-black text-[10px] font-black uppercase flex items-center gap-1"
                >
                  <Plus size={14} /> Add Ingredient
                </button>
              </div>
              <div className="grid gap-3">
                {item.otherIngredients.map((ing, iIdx) => (
                  <div key={ing.id} className="flex gap-4 items-center animate-in slide-in-from-left-2 duration-300">
                    <input 
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:border-black outline-none text-black"
                      placeholder="Ingredient Name"
                      value={ing.name}
                      onChange={e => {
                        const copy = [...data.menu];
                        copy[index].otherIngredients[iIdx].name = e.target.value;
                        setData({...data, menu: copy});
                      }}
                    />
                    <input 
                      className="w-32 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:border-black outline-none text-center text-black"
                      placeholder="Quantity"
                      value={ing.qty}
                      onChange={e => {
                        const copy = [...data.menu];
                        copy[index].otherIngredients[iIdx].qty = e.target.value;
                        setData({...data, menu: copy});
                      }}
                    />
                    <button onClick={() => {
                      const copy = [...data.menu];
                      copy[index].otherIngredients.splice(iIdx, 1);
                      setData({...data, menu: copy});
                    }} className="text-zinc-300 hover:text-black transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderKitchen = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-black">Kitchen Specs</h2>
        <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] mt-2">Shared Prep Space Logistics</p>
      </div>

      <div className="space-y-8">
        <div className="fume-card p-12 rounded-[3rem] space-y-12 bg-white shadow-sm border border-zinc-100">
          <div className="flex items-center justify-between p-8 bg-zinc-50 rounded-[2rem] border border-zinc-100">
            <div>
              <h4 className="font-black uppercase tracking-widest text-black">Need Kitchen Access?</h4>
              <p className="text-xs text-zinc-400 mt-1">We have professional kitchen space available for your usage.</p>
            </div>
            <button 
              onClick={() => setData({...data, kitchen: {...data.kitchen, needsKitchen: !data.kitchen.needsKitchen}})}
              className={`w-16 h-8 rounded-full transition-all relative ${data.kitchen.needsKitchen ? 'bg-black' : 'bg-zinc-200'}`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full transition-all ${data.kitchen.needsKitchen ? 'right-1 bg-white' : 'left-1 bg-zinc-400'}`}></div>
            </button>
          </div>

          {data.kitchen.needsKitchen && (
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-300">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Purpose of Usage</label>
                  <textarea 
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-sm min-h-[120px] focus:border-black outline-none text-black"
                    placeholder="e.g. Trimming chicken, cold prep for sides..."
                    value={data.kitchen.purpose}
                    onChange={e => setData({...data, kitchen: {...data.kitchen, purpose: e.target.value}})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Specific Kitchen Equipment Required</label>
                  <textarea 
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-sm min-h-[120px] focus:border-black outline-none text-black"
                    placeholder="e.g. Large blenders, commercial ovens..."
                    value={data.kitchen.specificEquipment}
                    onChange={e => setData({...data, kitchen: {...data.kitchen, specificEquipment: e.target.value}})}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderEquipment = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-black">Operations</h2>
        <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] mt-2">Gear on site</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {EQUIPMENT_TEMPLATES.map(temp => (
          <button 
            key={temp.label}
            onClick={() => {
              setData({ ...data, equipment: [...data.equipment, {
                id: generateId(), item: temp.label, spec: '', qty: 1, dateNeeded: ''
              }]});
            }}
            className="p-6 bg-zinc-50 border border-zinc-200 rounded-[2rem] hover:border-black hover:bg-zinc-100 transition-all flex flex-col items-center group shadow-sm"
          >
            <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{temp.icon}</span>
            <span className="text-[10px] font-black uppercase text-center leading-tight tracking-tight text-zinc-400 group-hover:text-black">{temp.label}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {data.equipment.map((item, index) => (
          <div key={item.id} className="fume-card p-8 rounded-[2.5rem] flex flex-wrap md:flex-nowrap items-center gap-10 shadow-sm bg-white border border-zinc-100">
            <div className="bg-black text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 font-black shadow-md">
               {EQUIPMENT_TEMPLATES.find(t => t.label === item.item)?.icon || '🛠️'}
            </div>
            <div className="flex-1 min-w-[200px] space-y-4">
              <input className="w-full bg-transparent font-black text-xl uppercase tracking-widest outline-none border-b border-zinc-100 focus:border-black transition-colors text-black" value={item.item} onChange={e => {
                const copy = [...data.equipment]; copy[index].item = e.target.value; setData({...data, equipment: copy});
              }} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-400">Specification</label>
                  <input className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:border-black outline-none text-black" placeholder="Size, model, details..." value={item.spec} onChange={e => {
                    const copy = [...data.equipment]; copy[index].spec = e.target.value; setData({...data, equipment: copy});
                  }} />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-zinc-400">Date Needed</label>
                  <input type="date" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:border-black outline-none text-black" value={item.dateNeeded} onChange={e => {
                    const copy = [...data.equipment]; copy[index].dateNeeded = e.target.value; setData({...data, equipment: copy});
                  }} />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <label className="text-[9px] font-black uppercase text-zinc-400">Qty</label>
              <div className="flex items-center gap-4 bg-zinc-50 rounded-full px-4 py-2 border border-zinc-100">
                <button onClick={() => {
                  const copy = [...data.equipment]; copy[index].qty = Math.max(1, copy[index].qty - 1); setData({...data, equipment: copy});
                }} className="font-bold text-xl">-</button>
                <span className="font-black text-black">{item.qty}</span>
                <button onClick={() => {
                  const copy = [...data.equipment]; copy[index].qty += 1; setData({...data, equipment: copy});
                }} className="font-bold text-xl">+</button>
              </div>
            </div>
            <button onClick={() => setData({...data, equipment: data.equipment.filter(e => e.id !== item.id)})} className="text-zinc-200 hover:text-black transition-colors">
              <Trash2 size={24} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFuel = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-black">Fuel</h2>
      </div>
      <div className="space-y-8">
        {data.fuel.map((item, index) => (
          <div key={item.id} className="fume-card p-12 rounded-[3.5rem] space-y-10 bg-white border border-zinc-100 shadow-sm">
            <VisualSelector options={FUEL_OPTIONS} selected={item.type} onSelect={val => {
              const copy = [...data.fuel]; copy[index].type = val; setData({...data, fuel: copy});
            }} />
            <div className="grid md:grid-cols-3 gap-10">
              <input className="bg-transparent border-b border-zinc-100 p-2 text-black focus:border-black outline-none" placeholder="Spec" value={item.spec} onChange={e => {
                const copy = [...data.fuel]; copy[index].spec = e.target.value; setData({...data, fuel: copy});
              }} />
              <input className="bg-transparent border-b border-zinc-100 p-2 text-black focus:border-black outline-none" placeholder="Quantity" value={item.qty} onChange={e => {
                const copy = [...data.fuel]; copy[index].qty = e.target.value; setData({...data, fuel: copy});
              }} />
              <input type="date" className="bg-transparent border-b border-zinc-100 p-2 text-black focus:border-black outline-none" value={item.dateNeeded} onChange={e => {
                const copy = [...data.fuel]; copy[index].dateNeeded = e.target.value; setData({...data, fuel: copy});
              }} />
            </div>
          </div>
        ))}
        <button onClick={() => setData({...data, fuel: [...data.fuel, {id: generateId(), type: 'Wood', spec: '', qty: '', dateNeeded: ''}]})} className="w-full py-8 border border-zinc-200 border-dashed rounded-[2.5rem] text-zinc-400 font-black uppercase tracking-widest hover:border-black hover:text-black transition-all">
          + Add Fuel Line
        </button>
      </div>
    </div>
  );

  const renderProcess = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-black">Protocol</h2>
        <p className="text-zinc-500 text-sm mt-6 leading-relaxed px-4">
          This section is designed to help us make the days before and during the live festival as smooth as possible. 
          Please describe your cooking and prep process so we can make the necessary arrangements for you.
        </p>
      </div>
      {data.process.map((item, index) => (
        <div key={item.id} className="fume-card p-10 rounded-[3rem] space-y-8 bg-white border border-zinc-100 shadow-sm">
          <div className="grid md:grid-cols-2 gap-10">
            <input type="datetime-local" className="bg-transparent border-b border-zinc-100 p-2 text-black focus:border-black outline-none" value={item.date} onChange={e => {
              const copy = [...data.process]; copy[index].date = e.target.value; setData({...data, process: copy});
            }} />
            <input className="bg-transparent border-b border-zinc-100 p-2 text-black focus:border-black outline-none uppercase font-black" placeholder="Activity" value={item.process} onChange={e => {
              const copy = [...data.process]; copy[index].process = e.target.value; setData({...data, process: copy});
            }} />
          </div>
          <textarea className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-black focus:border-black outline-none" placeholder="Result / Requirements" value={item.result} onChange={e => {
            const copy = [...data.process]; copy[index].result = e.target.value; setData({...data, process: copy});
          }} />
        </div>
      ))}
      <button onClick={() => setData({...data, process: [...data.process, {id: generateId(), date: '', process: '', result: '', requirements: []}]})} className="w-full py-8 border border-zinc-100 border-dashed rounded-[2.5rem] text-zinc-400 font-black uppercase tracking-widest hover:border-black hover:text-black transition-all">
        + Add Event
      </button>
    </div>
  );

  const renderStaff = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-black">The Crew</h2>
      </div>
      <div className="grid gap-8">
        {data.staff.map((member, idx) => (
          <div key={member.id} className="fume-card p-10 rounded-[3rem] space-y-10 bg-white border border-zinc-100 shadow-sm">
            <VisualSelector options={STAFF_ROLES} selected={member.role} onSelect={val => {
              const copy = [...data.staff]; copy[idx].role = val; setData({...data, staff: copy});
            }} />
            <div className="grid md:grid-cols-2 gap-8">
              <input className="bg-transparent border-b border-zinc-100 p-2 text-black font-black uppercase" placeholder="Full Name" value={member.fullName} onChange={e => {
                const copy = [...data.staff]; copy[idx].fullName = e.target.value; setData({...data, staff: copy});
              }} />
              <input className="bg-transparent border-b border-zinc-100 p-2 text-black" placeholder="Passport #" value={member.passportNumber} onChange={e => {
                const copy = [...data.staff]; copy[idx].passportNumber = e.target.value; setData({...data, staff: copy});
              }} />
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-400">Passport Expiry Date</label>
                <input type="date" className="w-full bg-transparent border-b border-zinc-100 p-2 text-black focus:border-black outline-none text-sm" value={member.passportExpiry} onChange={e => {
                  const copy = [...data.staff]; copy[idx].passportExpiry = e.target.value; setData({...data, staff: copy});
                }} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-zinc-400">Date of Birth</label>
                <input type="date" className="w-full bg-transparent border-b border-zinc-100 p-2 text-black focus:border-black outline-none text-sm" value={member.dob} onChange={e => {
                  const copy = [...data.staff]; copy[idx].dob = e.target.value; setData({...data, staff: copy});
                }} />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[9px] font-black uppercase text-zinc-400">Home Address</label>
                <input className="w-full bg-transparent border-b border-zinc-100 p-2 text-black focus:border-black outline-none text-sm" placeholder="Street, City, State, ZIP" value={member.address} onChange={e => {
                  const copy = [...data.staff]; copy[idx].address = e.target.value; setData({...data, staff: copy});
                }} />
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setData({...data, staff: data.staff.filter(s => s.id !== member.id)})} className="text-zinc-300 hover:text-black transition-colors flex items-center gap-2 text-[10px] font-black uppercase">
                <Trash2 size={16} /> Remove Member
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setData({...data, staff: [...data.staff, {id: generateId(), fullName: '', role: 'Chef', flightNeeded: true, passportNumber: '', passportExpiry: '', dob: '', address: ''}]})} className="w-full py-8 border border-zinc-100 border-dashed rounded-[2.5rem] text-zinc-400 font-black uppercase tracking-widest hover:border-black hover:text-black transition-all">
        + Add Crew Member
      </button>
    </div>
  );

  const renderFlights = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-black">Aviation</h2>
      </div>
      <div className="fume-card p-12 rounded-[3.5rem] grid md:grid-cols-2 gap-20 bg-white shadow-sm border border-zinc-100">
        <div className="space-y-10">
          <h4 className="text-black font-black italic uppercase border-b border-zinc-100 pb-4 flex items-center gap-3">USA ➔ UK</h4>
          <input className="w-full bg-transparent border-b border-zinc-100 p-2 text-xl font-bold uppercase text-black focus:border-black outline-none" placeholder="Departure HUB" value={data.flights.outboundAirport} onChange={e => updateFlights('outboundAirport', e.target.value)} />
          <input type="date" className="w-full bg-transparent border-b border-zinc-100 p-2 text-black focus:border-black outline-none" value={data.flights.outboundDate} onChange={e => updateFlights('outboundDate', e.target.value)} />
        </div>
        <div className="space-y-10">
          <h4 className="text-black font-black italic uppercase border-b border-zinc-100 pb-4 flex items-center gap-3">UK ➔ USA</h4>
          <input className="w-full bg-transparent border-b border-zinc-100 p-2 text-xl font-bold uppercase text-black focus:border-black outline-none" placeholder="Arrival HUB" value={data.flights.usArrivalAirport} onChange={e => updateFlights('usArrivalAirport', e.target.value)} />
          <input type="date" className="w-full bg-transparent border-b border-zinc-100 p-2 text-black focus:border-black outline-none" value={data.flights.inboundDate} onChange={e => updateFlights('inboundDate', e.target.value)} />
        </div>
      </div>
    </div>
  );

  const renderHotel = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-black">Accommodation</h2>
        <p className="text-zinc-400 text-xs uppercase tracking-[0.2em] mt-2">Hotel & Living Arrangements</p>
      </div>

      <div className="space-y-8">
        <div className="fume-card p-12 rounded-[3.5rem] space-y-12 bg-white border border-zinc-100 shadow-sm">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Number of Rooms Required</label>
              <input 
                className="w-full bg-transparent border-b border-zinc-100 p-2 text-2xl font-black text-black focus:border-black outline-none"
                placeholder="e.g. 4 Rooms"
                value={data.hotel.numRooms}
                onChange={e => setData({...data, hotel: {...data.hotel, numRooms: e.target.value}})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Room Specifications</label>
              <textarea 
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-sm min-h-[100px] focus:border-black outline-none text-black"
                placeholder="Please specify where individual rooms are needed vs shared/twin rooms..."
                value={data.hotel.roomSpec}
                onChange={e => setData({...data, hotel: {...data.hotel, roomSpec: e.target.value}})}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Check-In Date</label>
              <input type="date" className="w-full bg-transparent border-b border-zinc-100 p-2 text-black focus:border-black outline-none" value={data.hotel.checkIn} onChange={e => setData({...data, hotel: {...data.hotel, checkIn: e.target.value}})} />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Check-Out Date</label>
              <input type="date" className="w-full bg-transparent border-b border-zinc-100 p-2 text-black focus:border-black outline-none" value={data.hotel.checkOut} onChange={e => setData({...data, hotel: {...data.hotel, checkOut: e.target.value}})} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-12 animate-in zoom-in-95 fade-in duration-700 pb-20">
      <div className="text-center">
        <h2 className="text-6xl font-black italic uppercase tracking-tighter text-black">Summary</h2>
      </div>
      <div className="space-y-8">
        <div className="fume-card p-12 rounded-[3.5rem] border-t-4 border-black shadow-lg bg-white">
          <h3 className="text-4xl font-black uppercase italic tracking-tighter text-black mb-10">{data.teamName}</h3>
          <div className="grid md:grid-cols-3 gap-8 text-black">
            <div className="p-6 bg-zinc-50 rounded-2xl">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Menu</span>
              <span className="text-xl font-black">{data.menu.length} Items</span>
            </div>
            <div className="p-6 bg-zinc-50 rounded-2xl">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Staff</span>
              <span className="text-xl font-black">{data.staff.length} Active</span>
            </div>
            <div className="p-6 bg-zinc-50 rounded-2xl">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">Travel</span>
              <span className="text-xl font-black">{data.flights.outboundAirport || 'N/A'}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          className="w-full py-10 bg-black hover:bg-zinc-800 text-white font-black uppercase italic text-3xl rounded-[3rem] flex items-center justify-center gap-4 shadow-2xl transition-transform active:scale-95"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={40} />} SUBMIT MANIFEST
        </button>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen fume-gradient flex flex-col items-center justify-center p-10 text-center space-y-12">
        <div className="w-32 h-32 bg-black text-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
          <CheckCircle2 size={64} />
        </div>
        <div className="space-y-4">
          <ROOSTLogo />
          <h1 className="text-6xl font-black uppercase italic tracking-tighter text-black">MISSION COMPLETE</h1>
          <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed uppercase tracking-widest">We have received your manifest. Our logistics team will be in touch within 48 hours. Smoke on.</p>
        </div>
        <button onClick={() => { setSubmitted(false); setCurrentStep('intro'); setData(INITIAL_DATA); }} className="text-zinc-300 uppercase font-black text-[10px] tracking-[0.5em] hover:text-black transition-colors">NEW MANIFEST</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen fume-gradient text-black pb-40">
      <header className="sticky top-0 z-50 p-8 flex justify-between items-center backdrop-blur-3xl border-b border-zinc-100 bg-white/60">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-black text-white font-black flex items-center justify-center italic text-2xl shadow-lg">R</div>
           <span className="font-black italic uppercase tracking-tighter text-lg hidden sm:block">ONBOARDING</span>
        </div>
        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] px-6 py-2 bg-zinc-50 border border-zinc-100 rounded-full">
           {data.teamName || 'CHICKEN MASTER'}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8 pt-16">
        {currentStep !== 'intro' && renderProgress()}
        <div className="min-h-[60vh]">
          {currentStep === 'intro' && renderIntro()}
          {currentStep === 'info' && renderInfoPage()}
          {currentStep === 'menu' && renderMenu()}
          {currentStep === 'kitchen' && renderKitchen()}
          {currentStep === 'equipment' && renderEquipment()}
          {currentStep === 'fuel' && renderFuel()}
          {currentStep === 'process' && renderProcess()}
          {currentStep === 'staff' && renderStaff()}
          {currentStep === 'flights' && renderFlights()}
          {currentStep === 'hotel' && renderHotel()}
          {currentStep === 'review' && renderReview()}
        </div>
      </main>

      {currentStep !== 'intro' && (
        <div className="fixed bottom-0 left-0 right-0 p-10 backdrop-blur-3xl bg-white/60 border-t border-zinc-100 z-50">
          <div className="max-w-6xl mx-auto flex justify-between gap-8">
            <button onClick={goToPrev} className="px-12 py-6 bg-zinc-50 border border-zinc-200 hover:border-black text-black font-black uppercase italic rounded-full flex items-center gap-3 transition-all tracking-widest text-xs">
              <ArrowLeft size={20} /> BACK
            </button>
            <button onClick={goToNext} disabled={currentStep === 'review'} className="flex-1 sm:flex-initial px-20 py-6 bg-black hover:bg-zinc-800 disabled:opacity-0 disabled:pointer-events-none text-white font-black italic uppercase tracking-widest rounded-full flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl text-xs">
              CONTINUE <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
