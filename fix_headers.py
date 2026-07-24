import os
import glob
import re

files = glob.glob('src/app/(photographer)/event/[id]/settings/*.tsx') + glob.glob('src/app/(participant)/event/[id]/settings/*.tsx')

header_replacement = """      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop' }} 
        style={styles.headerBackground}
      >
        <View style={styles.headerOverlay}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft color="#fff" size={24} />
            </TouchableOpacity>
            <!--SAVE_BTN-->
          </View>
          <View style={styles.headerContent}>
            <!--TITLE-->
            <!--SUBTITLE-->
          </View>
        </View>
      </ImageBackground>"""

styles_replacement = """  headerBackground: { width: '100%', height: 160 },
  headerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 15, paddingTop: 15, justifyContent: 'space-between' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { padding: 4, flexDirection: 'row', alignItems: 'center' },
  headerContent: { paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  saveBtn: { backgroundColor: '#FF6B00', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },"""

for f in files:
    if "index.tsx" in f:
        continue
    
    with open(f, 'r') as file:
        content = file.read()
    
    # 1. Add ImageBackground import if not present
    if "ImageBackground" not in content:
        content = content.replace("import { View, Text", "import { View, Text, ImageBackground")

    # 2. Extract Title, Subtitle, SaveBtn from the existing header
    title_match = re.search(r'<Text style=\{styles\.headerTitle\}>(.*?)</Text>', content)
    sub_match = re.search(r'<Text style=\{styles\.headerSubtitle\}>(.*?)</Text>', content)
    save_match = re.search(r'(<TouchableOpacity.*?styles\.saveBtn.*?</TouchableOpacity>)', content, re.DOTALL)
    
    # Special cases for icons inside Title (e.g. Favorite)
    title_full_match = re.search(r'(<View style={{flexDirection: \'row\', alignItems: \'center\'}}>.*?</View>)', content, re.DOTALL)
    if title_full_match:
        title_str = title_full_match.group(1).replace('#FF3B30', '#fff')
    else:
        title_str = f'<Text style={{styles.headerTitle}}>{title_match.group(1) if title_match else ""}</Text>'

    sub_str = f'<Text style={{styles.headerSubtitle}}>{sub_match.group(1) if sub_match else ""}</Text>'
    save_str = save_match.group(1) if save_match else ''

    # 3. Replace the entire <View style={styles.header}> ... </View> block
    new_header = header_replacement.replace('<!--TITLE-->', title_str).replace('<!--SUBTITLE-->', sub_str).replace('<!--SAVE_BTN-->', save_str)
    
    # Find the header block
    header_block = re.search(r'<View style=\{styles\.header\}>.*?</View>\s*</View>\s*(<TouchableOpacity.*?saveBtn.*?</TouchableOpacity>)?\s*</View>', content, re.DOTALL)
    if not header_block:
         header_block = re.search(r'<View style=\{styles\.header\}>.*?</View>\s*</View>', content, re.DOTALL)
         
    if header_block:
        content = content.replace(header_block.group(0), new_header)

    # 4. Replace styles
    # Find styles.header and everything until content:
    style_block = re.search(r'  header: \{.*?\},\n.*?content: \{', content, re.DOTALL)
    if style_block:
        content = content.replace(style_block.group(0), styles_replacement + '\n\n  content: {')

    with open(f, 'w') as file:
        file.write(content)

