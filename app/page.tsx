'use client';

import { Check, ChevronLeft, ChevronRight, MessageSquarePlus, Send, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Company = 'Nguyên Kim' | 'Chính Nhân' | 'Kết Nối Thông Minh';
type Answer = { score?: number; firstImpression?: string; messageClarity?: string; good: string[]; improve: string[]; other: string; note: string };
type Draft = { name: string; department: string; company: Company | ''; answers: Record<string, Answer>; firstWebsiteNeed?: string; textAmount?: string; clickIntent?: string; global: string; currentStep?: number };
type Group = { name: string; images: [string, string] };

const departments = ['Marketing', 'Kinh doanh', 'PM Online', 'Mua hàng', 'Kỹ thuật', 'HCNS'];
const firstImpressions = ['Sản phẩm', 'Giá / Khuyến mãi', 'Nội dung chính', 'Màu sắc / Hình ảnh', 'Thương hiệu', 'Không có gì nổi bật'];
const clarityOptions = ['Hiểu ngay', 'Hiểu nhưng phải nhìn thêm', 'Hơi khó hiểu', 'Không hiểu rõ'];
const goodOptions = ['Sản phẩm nổi bật', 'Màu sắc đẹp', 'Dễ đọc', 'Nội dung rõ ràng', 'Giá / Khuyến mãi nổi bật', 'Nhìn hiện đại', 'Nhận diện thương hiệu rõ', 'Không có điểm nào đặc biệt'];
const improveOptions = ['Làm sản phẩm nổi bật hơn', 'Giảm bớt chữ', 'Làm nội dung dễ hiểu hơn', 'Làm giá / Khuyến mãi nổi bật hơn', 'Màu sắc thu hút hơn', 'Sắp xếp lại cho dễ nhìn', 'Làm thương hiệu rõ hơn', 'Không cần chỉnh', 'Khác'];
const scoreLevels = [
  ['Chưa đạt', 'Khó hiểu / chưa thu hút'],
  ['Cần cải thiện', 'Có ý nhưng còn nhiều điểm chưa ổn'],
  ['Đạt', 'Dễ hiểu / có thể sử dụng'],
  ['Tốt', 'Rõ ràng / đẹp / khá thu hút'],
  ['Rất tốt', 'Nổi bật / dễ hiểu / tạo ấn tượng ngay'],
] as const;
const websiteFirst = ['Sản phẩm', 'Giá', 'Khuyến mãi', 'Điểm nổi bật của sản phẩm', 'Thương hiệu', 'Nút xem thêm / mua hàng'];
const textAmounts = ['Quá nhiều', 'Hơi nhiều', 'Vừa đủ', 'Có thể thêm thông tin'];
const clickIntents = ['Rất muốn', 'Có thể', 'Không chắc', 'Không muốn'];

const data: Record<Company, Group[]> = {
  'Nguyên Kim': [
    { name: 'Laptop', images: ['/banners/4.png', '/banners/731761836_1660404446092190_8940495999503197811_n.jpg'] },
    { name: 'PC', images: ['/banners/3.png', '/banners/747625327_1674673154665319_3302438534809789923_n.jpg'] },
    { name: 'LCD / Màn hình', images: ['/banners/616811699_1511266151006021_9046361683076941228_n.jpg', '/banners/666047947_1583526670446635_3788494658393941418_n.jpg'] },
    { name: 'Phụ kiện', images: ['/banners/CMLO_910_005882.png', '/banners/CWLO_C925.png'] },
    { name: 'Linh kiện', images: ['/banners/1788936265228_201525182566124453_7011973515233209377_edb5b45b607ea665f81233fcaa32c182.jpg', '/banners/672681412_1591893246276644_3636714957270481989_n.jpg'] },
    { name: 'Phần mềm', images: ['/banners/8.png', '/banners/Lightroom%20w%20Classic.png'] },
    { name: 'Máy in', images: ['/banners/1788860801422_201525182566124453_7011973515233209377_bedf5f81fd6617aa51f977aa1b4521fb.jpg', '/banners/6.png'] },
  ],
  'Chính Nhân': [
    { name: 'Laptop', images: ['/banners/IdeaPad%20Slim%203%20-%20Copy.jpg', '/banners/Lenovo%20LOQ%20Essential.jpg'] },
    { name: 'PC', images: ['/banners/767483411_1513397350826846_8996851914196950690_n.jpg', '/banners/OP2q.png'] },
    { name: 'LCD / Màn hình', images: ['/banners/Asus%20ProArt.png', '/banners/viewsonic.png'] },
    { name: 'Phụ kiện', images: ['/banners/611256711_1326692079497375_270400890844479602_n.jpg', '/banners/663238762_1399808015519114_3412210904947284787_n.jpg'] },
    { name: 'Linh kiện', images: ['/banners/HDD%20Western%20Digital%20Red%20Plus%204TB%20(WD40EFZZ).png', '/banners/intel%20i7.png'] },
    { name: 'Phần mềm', images: ['/banners/759849593_1505911754908739_2896106695699517857_n.jpg', '/banners/768432914_1511600697673178_2122626592133173619_n.jpg'] },
    { name: 'Máy in', images: ['/banners/cnhan%20min.png', '/banners/epson.png'] },
  ],
  'Kết Nối Thông Minh': [
    { name: 'Aqara', images: ['/banners/aqara-01.jpg', '/banners/aqara-02.jpg'] },
    { name: 'EcoFlow', images: ['/banners/ecoflow-01.jpg', '/banners/ecoflow-02.jpg'] },
    { name: 'Wanbo', images: ['/banners/wanbo-01.jpg', '/banners/wanbo-02.jpg'] },
  ],
};

const endpoint = 'https://script.google.com/macros/s/AKfycbzOEmCT-VvR_TDJ-ycWrOKiahjjOxIUL7ddas69u_0y_FtrLe67s0vILxoTR9sszZCR/exec';
const blank = (): Answer => ({ good: [], improve: [], other: '', note: '' });
const initial: Draft = { name: '', department: '', company: '', answers: {}, global: '' };
const itemKey = (company: string, name: string) => company + ' • ' + name;
const getCompanyTheme = (company: Draft['company']) => company === 'Nguyên Kim' ? 'nk' : company === 'Chính Nhân' ? 'cn' : company === 'Kết Nối Thông Minh' ? 'smc' : '';
const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '');

function Radios({ items, value, onChange, label }: { items: string[]; value?: string; onChange: (value: string) => void; label: string }) {
  return <div className="radio-cards" role="radiogroup" aria-label={label}>{items.map(item =>
    <button type="button" role="radio" aria-checked={value === item} className={value === item ? 'on' : ''} key={item} onClick={() => onChange(item)}>
      {value === item && <Check size={15} />}<span>{item}</span>
    </button>
  )}</div>;
}

function Multi({ items, value, onChange, exclusive }: { items: string[]; value: string[]; onChange: (value: string[]) => void; exclusive: string }) {
  const toggle = (item: string) => {
    if (item === exclusive) return onChange(value.includes(item) ? [] : [item]);
    const next = value.includes(item) ? value.filter(x => x !== item) : [...value.filter(x => x !== exclusive), item];
    if (next.length <= 2) onChange(next);
  };
  return <div className="chips compact">{items.map(item =>
    <button type="button" className={value.includes(item) ? 'on' : ''} aria-pressed={value.includes(item)} key={item} onClick={() => toggle(item)}>
      {value.includes(item) && <Check size={14} />} {item}
    </button>
  )}</div>;
}

export default function Home() {
  const [draft, setDraft] = useState<Draft>(initial);
  const [ready, setReady] = useState(false);
  const [welcome, setWelcome] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [extraOpen, setExtraOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nkc-banner-review-final');
      if (saved) {
        const parsed = JSON.parse(saved) as Draft;
        setDraft({ ...initial, ...parsed, answers: parsed.answers || {} });
        setWelcome(!(parsed.name && parsed.department && parsed.company));
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem('nkc-banner-review-final', JSON.stringify(draft)); }, [draft, ready]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setPhoto(null);
    addEventListener('keydown', close);
    return () => removeEventListener('keydown', close);
  }, []);
  const groups = draft.company ? data[draft.company] : [];
  const currentStep = Math.min(Math.max(draft.currentStep || 0, 0), groups.length);
  const answer = (name: string) => draft.answers[itemKey(draft.company, name)] || blank();
  const patch = (name: string, change: Partial<Answer>) => setDraft(current => ({
    ...current,
    answers: { ...current.answers, [itemKey(current.company, name)]: { ...blank(), ...current.answers[itemKey(current.company, name)], ...change } },
  }));
  const complete = (name: string) => {
    const current = answer(name);
    return Boolean(current.firstImpression && current.messageClarity && current.score);
  };
  const rated = useMemo(() => groups.filter(group => complete(group.name)).length, [groups, draft.answers, draft.company]);

  const moveToStep = (step: number) => {
    const safeStep = Math.min(Math.max(step, 0), groups.length);
    setDraft(current => ({ ...current, currentStep: safeStep }));
    window.setTimeout(() => document.getElementById('survey-step')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const validateGroup = (group: Group) => {
    const current = answer(group.name);
    const missing = !current.firstImpression ? 'first-' + group.name : !current.messageClarity ? 'clarity-' + group.name : !current.score ? 'score-' + group.name : '';
    if (!missing) return true;
    setErrors(items => [...items.filter(item => !item.endsWith(group.name)), missing]);
    setMessage('Vui lòng hoàn tất 3 câu chính.');
    document.getElementById(missing)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  };

  const validate = () => {
    const next: string[] = [];
    if (!draft.name.trim() || !draft.department.trim() || !draft.company) next.push('profile');
    groups.forEach(group => {
      const current = answer(group.name);
      if (!current.firstImpression) next.push('first-' + group.name);
      else if (!current.messageClarity) next.push('clarity-' + group.name);
      else if (!current.score) next.push('score-' + group.name);
    });
    setErrors(next);
    if (next.length) {
      const groupIndex = groups.findIndex(group => next.some(error => error.endsWith(group.name)));
      if (groupIndex >= 0) setDraft(current => ({ ...current, currentStep: groupIndex }));
      document.getElementById(next[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setMessage(!draft.department.trim() ? 'Vui lòng nhập phòng ban.' : 'Vui lòng chọn một đáp án ở mục được đánh dấu.');
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (sending || !validate()) return;
    setSending(true);
    try {
      const payload = {
        timestamp: new Date().toISOString(), name: draft.name, department: draft.department, company: draft.company,
        categories: groups.map(group => ({ category: group.name, ...answer(group.name) })),
        firstWebsiteNeed: draft.firstWebsiteNeed || '', textAmount: draft.textAmount || '', clickIntent: draft.clickIntent || '', globalNote: draft.global,
      };
      const token = crypto.randomUUID();
      await new Promise<void>((resolve, reject) => {
        const frameName = 'nkc-sheet-submit';
        let frame = document.querySelector<HTMLIFrameElement>('iframe[name="' + frameName + '"]');
        if (!frame) { frame = document.createElement('iframe'); frame.name = frameName; frame.hidden = true; document.body.appendChild(frame); }
        const form = document.createElement('form');
        form.method = 'POST'; form.action = endpoint; form.target = frameName; form.hidden = true;
        [['payload', JSON.stringify(payload)], ['token', token]].forEach(([name, value]) => { const input = document.createElement('input'); input.name = name; input.value = value; form.appendChild(input); });
        document.body.appendChild(form);
        const clean = () => { window.removeEventListener('message', listener); form.remove(); };
        const timeout = window.setTimeout(() => { clean(); reject(new Error('timeout')); }, 15000);
        const listener = (event: MessageEvent) => {
          const result = event.data;
          if (result?.source !== 'nkc-banner-survey' || result?.token !== token) return;
          clearTimeout(timeout); clean(); result.ok ? resolve() : reject(new Error(result.error || 'failed'));
        };
        window.addEventListener('message', listener); form.submit();
      });
      localStorage.removeItem('nkc-banner-review-final'); setDone(true);
    } catch { setMessage('Chưa thể xác nhận dữ liệu đã được lưu. Vui lòng thử lại.'); setSending(false); }
  };

  return <main className={'survey ' + getCompanyTheme(draft.company)}>
    <header><div className="bar">
      <div className="brand"><img src={asset('/nkc-logo.png')} alt="NKC" /><span>KHẢO SÁT BANNER 2026<small>Đánh giá nội bộ</small></span></div>
      {draft.company && <div className="progress"><b>Đã đánh giá {rated}/{groups.length} nhóm</b><i><em style={{ width: (rated / groups.length * 100) + '%' }} /></i></div>}
    </div></header>
    <div className="wrap">
      <section className="hero"><p>ĐÁNH GIÁ BANNER WEBSITE</p><h1>Xem nhanh, góp ý dễ.</h1><span>Mỗi nhóm có 2 banner. Bạn chỉ cần đánh giá chung một lần.</span></section>
      <section id="profile" className={'card profile ' + (errors.includes('profile') ? 'error' : '')}>
        <div className="head"><div><p>THÔNG TIN</p><h2>Người đánh giá</h2></div><button className="edit-profile" type="button" onClick={() => setWelcome(true)}>Chỉnh sửa</button></div>
        <div className="profile-summary"><span>{draft.name || 'Chưa nhập tên'}</span><span>{draft.department || 'Chưa chọn phòng ban'}</span><span>{draft.company || 'Chưa chọn công ty'}</span></div>
      </section>
      {draft.company ? <>
        <nav className="step-nav" aria-label="Điều hướng nhóm banner">{groups.map((group, index) => { const available = index <= currentStep || complete(group.name); return <button type="button" key={group.name} className={(index === currentStep ? 'active ' : '') + (complete(group.name) ? 'complete' : '')} aria-current={index === currentStep ? 'step' : undefined} onClick={() => available && moveToStep(index)} disabled={!available}>{complete(group.name) ? <Check size={14} /> : String(index + 1).padStart(2, '0')}<span>{group.name}</span></button>; })}</nav>
        <div id="survey-step" className="stepper">
          {currentStep < groups.length ? (() => {
            const group = groups[currentStep];
            const current = answer(group.name);
            const hasExtra = current.good.length > 0 || current.improve.length > 0 || Boolean(current.other || current.note);
            const expanded = extraOpen[group.name] ?? hasExtra;
            return <section className={'card category step-card ' + (errors.some(error => error.endsWith(group.name)) ? 'error' : '')}>
              <div className="category-head"><div><p>NHÓM BANNER {String(currentStep + 1).padStart(2, '0')} / {String(groups.length).padStart(2, '0')}</p><h2>{group.name}</h2><span>2 banner · 1 đánh giá chung</span></div><small>{complete(group.name) ? <><Check size={14} /> Đã đánh giá</> : 'Chưa đánh giá'}</small></div>
              <div className="banners">{group.images.map((image, imageIndex) => <button type="button" className="banner" key={image} onClick={() => setPhoto(image)}><b>OPTION 0{imageIndex + 1}</b><div><img src={asset(image)} alt={'Banner ' + (imageIndex + 1) + ' ' + group.name} loading="eager" /></div><small>Nhấn để xem ảnh lớn</small></button>)}</div>
              <div id={'first-' + group.name} className={'question ' + (!current.firstImpression ? '' : 'answered')}><h3><i>01</i>Trong 3 giây đầu, bạn chú ý điều gì nhất? <b>*</b></h3><p>Chọn điều bạn nhìn thấy hoặc nhớ đến đầu tiên.</p><Radios items={firstImpressions} value={current.firstImpression} label="3 giây đầu" onChange={value => { patch(group.name, { firstImpression: value }); setErrors(items => items.filter(item => item !== 'first-' + group.name)); }} />{errors.includes('first-' + group.name) && <em className="invalid">Vui lòng chọn một đáp án.</em>}</div>
              <div id={'clarity-' + group.name} className={'question ' + (current.firstImpression && !current.messageClarity ? 'guided' : '')}><h3><i>02</i>Bạn có hiểu banner đang muốn nói gì không? <b>*</b></h3><Radios items={clarityOptions} value={current.messageClarity} label="Mức độ hiểu" onChange={value => { patch(group.name, { messageClarity: value }); setErrors(items => items.filter(item => item !== 'clarity-' + group.name)); }} />{errors.includes('clarity-' + group.name) && <em className="invalid">Vui lòng chọn một đáp án.</em>}</div>
              <div id={'score-' + group.name} className={'question ' + (current.messageClarity && !current.score ? 'guided' : '')}><h3><i>03</i>Nhìn chung, bạn thấy nhóm banner này thế nào? <b>*</b></h3><div className="score-cards">{scoreLevels.map(([label, description], score) => <button type="button" className={current.score === score + 1 ? 'on' : ''} aria-pressed={current.score === score + 1} key={label} onClick={() => { patch(group.name, { score: score + 1 }); setErrors(items => items.filter(item => item !== 'score-' + group.name)); }}><strong>{score + 1}</strong><span>{label}</span><small>{description}</small></button>)}</div>{errors.includes('score-' + group.name) && <em className="invalid">Vui lòng chọn điểm đánh giá.</em>}</div>
              <div className="extra-feedback"><button type="button" className="extra-toggle" aria-expanded={expanded} onClick={() => setExtraOpen(items => ({ ...items, [group.name]: !expanded }))}><MessageSquarePlus size={17} />{expanded ? 'Thu gọn góp ý thêm' : 'Góp ý thêm'}<span>{expanded ? '−' : '+'}</span></button>{expanded && <div className="extra-content">
                <div className="question"><h3><i>04</i>Điều bạn thích nhất ở nhóm banner này là gì?</h3><p>Chọn tối đa 2.</p><Multi items={goodOptions} value={current.good} onChange={good => patch(group.name, { good })} exclusive="Không có điểm nào đặc biệt" /></div>
                <div className="question"><h3><i>05</i>Bạn muốn banner được chỉnh gì nhất?</h3><p>Chọn tối đa 2.</p><Multi items={improveOptions} value={current.improve} onChange={improve => patch(group.name, { improve })} exclusive="Không cần chỉnh" />{current.improve.includes('Khác') && <label className="other">Bạn muốn chỉnh gì khác?<input value={current.other} onChange={event => patch(group.name, { other: event.target.value })} placeholder="Mô tả ngắn ý bạn" /></label>}</div>
                <div className="question"><h3><i>06</i>Nếu chỉ được sửa 1 điều,{" "}bạn muốn sửa gì?</h3><textarea rows={2} value={current.note} onChange={event => patch(group.name, { note: event.target.value })} placeholder="Ví dụ: Cho sản phẩm lớn hơn, giảm chữ, làm giá nổi bật hơn..." /></div>
              </div>}</div>
              <div className="step-actions"><button type="button" className="previous" onClick={() => moveToStep(currentStep - 1)} disabled={currentStep === 0}><ChevronLeft size={17} /> Trước</button><button type="button" className="next" onClick={() => validateGroup(group) && moveToStep(currentStep + 1)}>{currentStep === groups.length - 1 ? 'Hoàn tất đánh giá' : 'Tiếp theo'} <ChevronRight size={17} /></button></div>
            </section>;
          })() : <section className="card final step-card"><div className="head"><div><p>HOÀN TẤT KHẢO SÁT</p><h2>Góp ý chung</h2><span>Thêm vài ý ngắn để Marketing cải thiện banner tốt hơn.</span></div></div>
            <div className="question"><h3>Khi xem banner trên website, bạn thường muốn thấy điều gì đầu tiên?</h3><Radios items={websiteFirst} value={draft.firstWebsiteNeed} label="Điều muốn thấy" onChange={firstWebsiteNeed => setDraft(current => ({ ...current, firstWebsiteNeed }))} /></div>
            <div className="question"><h3>Bạn thấy lượng chữ trên banner hiện nay thế nào?</h3><Radios items={textAmounts} value={draft.textAmount} label="Lượng chữ" onChange={textAmount => setDraft(current => ({ ...current, textAmount }))} /></div>
            <div className="question"><h3>Banner hiện tại có khiến bạn muốn bấm vào xem sản phẩm không?</h3><Radios items={clickIntents} value={draft.clickIntent} label="Ý định click" onChange={clickIntent => setDraft(current => ({ ...current, clickIntent }))} /></div>
            <div className="question"><h3>Bạn muốn banner website trong thời gian tới thay đổi điều gì nhất?</h3><textarea rows={2} value={draft.global} onChange={event => setDraft(current => ({ ...current, global: event.target.value }))} placeholder="Chia sẻ điều bạn muốn Marketing cải thiện..." /></div>
            <div className="step-actions"><button type="button" className="previous" onClick={() => moveToStep(groups.length - 1)}><ChevronLeft size={17} /> Quay lại</button><button type="button" className="submit next" onClick={submit} disabled={sending}>{sending ? 'ĐANG GỬI...' : <><Send size={17} /> GỬI KHẢO SÁT</>}</button></div><p className="thanks">Cảm ơn bạn đã dành thời gian góp ý để Marketing hoàn thiện banner website.</p>
          </section>}
        </div>
      </> : <section className="card empty"><h2>Chọn công ty để bắt đầu</h2><p>Website chỉ hiển thị banner thuộc công ty bạn chọn.</p></section>}
    </div>
    {welcome && <div className="welcome" role="dialog" aria-modal="true" aria-label="Bắt đầu khảo sát"><section>
      <img className="welcome-logo" src={asset('/nkc-logo.png')} alt="NKC" /><p>KHẢO SÁT BANNER 2026</p><h2>Bắt đầu đánh giá</h2><span>Điền thông tin một lần, sau đó xem banner và trả lời ngắn gọn.</span>
      <label>Họ và tên <b>*</b><input autoFocus value={draft.name} onChange={event => setDraft(current => ({ ...current, name: event.target.value }))} placeholder="Nhập họ và tên" /></label>
      <label>Phòng ban <b>*</b><input list="department-options" value={draft.department} onChange={event => setDraft(current => ({ ...current, department: event.target.value }))} placeholder="Nhập hoặc chọn phòng ban" /><datalist id="department-options">{departments.map(department => <option value={department} key={department} />)}</datalist></label>
      <div className="welcome-company"><label>Công ty <b>*</b></label><div className="companies">{([
        ['Nguyên Kim', 'Vi Tính Nguyên Kim'], ['Chính Nhân', 'Công Nghệ Chính Nhân'], ['Kết Nối Thông Minh', 'SMC'],
      ] as [Company, string][]).map(([company, subtitle]) => <button type="button" key={company} className={draft.company === company ? 'on' : ''} onClick={() => setDraft(current => ({ ...current, company, currentStep: 0 }))}><strong>{company}</strong><small>{subtitle}</small></button>)}</div></div>
      <button className="start" type="button" onClick={() => draft.name.trim() && draft.department.trim() && draft.company ? setWelcome(false) : setMessage(!draft.department.trim() ? 'Vui lòng nhập phòng ban.' : 'Vui lòng nhập tên và chọn công ty.')}>BẮT ĐẦU KHẢO SÁT</button>
    </section></div>}
    {message && <button className="toast" onClick={() => setMessage('')}>{message}<X size={16} /></button>}
    {photo && <div className="lightbox" role="dialog" aria-modal="true" onMouseDown={() => setPhoto(null)}><button onClick={() => setPhoto(null)} aria-label="Đóng ảnh lớn"><X /></button><img src={asset(photo)} alt="Banner xem lớn" onMouseDown={event => event.stopPropagation()} /></div>}
    {done && <div className="success"><div><Check size={30} /><h2>Cảm ơn bạn đã hoàn thành khảo sát!</h2><p>Ý kiến của bạn đã được ghi nhận và sẽ được dùng để cải thiện banner tiếp theo.</p></div></div>}
  </main>;
}
