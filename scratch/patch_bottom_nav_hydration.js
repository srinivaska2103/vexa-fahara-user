const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/components/navigation/MobileBottomNav.jsx');
let s = fs.readFileSync(filePath, 'utf8');

// 1. Add mounted state
if (!s.includes('const [isMounted, setIsMounted] = useState(false);')) {
  s = s.replace(
    '  const [profileImage, setProfileImage] = useState(user?.avatar || user?.profile_image || null);',
    '  const [isMounted, setIsMounted] = useState(false);\n  const [profileImage, setProfileImage] = useState(user?.avatar || user?.profile_image || null);'
  );

  s = s.replace(
    '  useEffect(() => {\n    if (!user) return;',
    '  useEffect(() => {\n    setIsMounted(true);\n  }, []);\n\n  useEffect(() => {\n    if (!user) return;'
  );
}

// 2. Prevent SSR render mismatch until mounted on client
if (!s.includes('if (!isMounted) return null;')) {
  s = s.replace(
    '  const userInitial = user?.name',
    '  if (!isMounted) return null;\n\n  const userInitial = user?.name'
  );
}

fs.writeFileSync(filePath, s, 'utf8');
console.log('MobileBottomNav hydration mismatch resolved! 📱✅');
