import 'core-js/stable';

// 添加 iOS 兼容性修复
if (typeof window !== 'undefined') {
  // 修复 iOS 滚动回弹问题
  document.addEventListener('touchmove', function(event) {
    if (event.scale !== 1) {
      event.preventDefault();
    }
  }, { passive: false });

  // 修复 iOS 双击缩放问题
  document.addEventListener('touchend', function(event) {
    if (event.changedTouches.length > 1) {
      event.preventDefault();
    }
  }, { passive: false });
}
