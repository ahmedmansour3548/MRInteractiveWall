import { useNavigate } from 'react-router-dom';
import SlidingDrawer from './SlidingDrawer';

const UIPanel = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '20px', position: 'fixed', bottom: '20px', right: '20px', background: '#f0f0f0', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
            <button onClick={() => navigate('/ar')} style={{ marginRight: '10px' }}>Go to AR</button>
            <SlidingDrawer />
        </div>
    );
};

export default UIPanel;