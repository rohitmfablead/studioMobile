const fs = require('fs');
const files = [
  'src/app/(photographer)/event/[id].tsx',
  'src/app/(participant)/event/[id].tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add renderLimit state
  content = content.replace(
    /const \[page, setPage\] = useState\(1\);/,
    `const [page, setPage] = useState(1);\n  const [renderLimit, setRenderLimit] = useState(18);`
  );

  // 2. Add useEffect to auto-increment renderLimit so they don't have to scroll to see the rest of the first page
  // Actually, better to just let it increment on scroll to save memory.
  
  // 3. Update handleScroll
  // Previous:
  //         if (!isFetchingRef.current && PHOTOS.length >= page * 50) {
  //           setPage(prev => prev + 1);
  //         }
  content = content.replace(
    /if \(!isFetchingRef\.current && PHOTOS\.length >= page \* 50\) \{\n\s*setPage\(prev => prev \+ 1\);\n\s*\}/g,
    `if (renderLimit < PHOTOS.length) {\n            setRenderLimit(prev => prev + 18);\n          } else if (!isFetchingRef.current && PHOTOS.length >= page * 50) {\n            setPage(prev => prev + 1);\n            setRenderLimit(prev => prev + 18);\n          }`
  );

  // 4. Update the FlatList data prop for 'all' tab
  // Previous: <FlatList\n                      data={PHOTOS}\n
  content = content.replace(
    /<FlatList\s+data=\{PHOTOS\}/g,
    `<FlatList\n                      data={PHOTOS.slice(0, renderLimit)}`
  );

  fs.writeFileSync(file, content, 'utf8');
});
