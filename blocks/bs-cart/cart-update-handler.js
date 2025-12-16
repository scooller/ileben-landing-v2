/**
 * Bootstrap Cart Block - Cart Update Handler
 * Handles automatic checkout page updates when cart changes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run if we have a cart block and we're on the checkout page
    const cartBlock = document.querySelector('[data-cart-block="true"]');
    const isCheckout = document.body.classList.contains('woocommerce-checkout');
    
    if (!cartBlock) {
        return;
    }

    /**
     * Refresh checkout order review on cart block parent
     */
    function refreshCheckoutReview() {
        if (!isCheckout) {
            return;
        }

        const checkoutReview = document.querySelector('.woocommerce-checkout-review-order');
        if (!checkoutReview) {
            return;
        }

        // Trigger WooCommerce's checkout update
        if (typeof jQuery !== 'undefined') {
            jQuery(document.body).trigger('update_checkout');
        }
    }

    /**
     * Handle cart updates with debouncing to avoid multiple simultaneous requests
     */
    let updateTimeout;
    function handleCartUpdate() {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(function() {
            refreshCheckoutReview();
        }, 500);
    }

    /**
     * Listen to WooCommerce cart events
     */
    if (typeof jQuery !== 'undefined') {
        jQuery(document.body).on('added_to_cart removed_from_cart updated_cart_totals', function() {
            handleCartUpdate();
        });
    }

    /**
     * Also listen to fragment refresh completion (WooCommerce AJAX events)
     */
    if (typeof jQuery !== 'undefined') {
        jQuery(document.body).on('wc_fragments_refreshed', function() {
            refreshCheckoutReview();
        });
    }

    /**
     * Handle quantity increase/decrease buttons
     */
    document.addEventListener('click', function(e) {
        // Handle quantity plus button
        if (e.target.closest('.qty-plus, .cart-qty-plus')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            const button = e.target.closest('.qty-plus, .cart-qty-plus');
            const cartItemKey = button.dataset.cartItemKey;
            const maxStock = parseInt(button.dataset.maxStock) || 9999;
            
            if (cartItemKey) {
                // Get current quantity from display
                const qtyDisplay = document.querySelector(`.qty-display[data-cart-item-key="${cartItemKey}"]`);
                const currentQty = parseInt(qtyDisplay?.textContent?.trim()) || 0;
                
                console.log('Current Qty:', currentQty, 'Max Stock:', maxStock);
                
                // Check if we can increase
                if (currentQty >= maxStock) {
                    // Show stock limit warning
                    showStockWarning(button, maxStock);
                } else {
                    updateCartItemQuantity(cartItemKey, 'increase');
                }
            }
            return false;
        }
        
        // Handle quantity minus button
        if (e.target.closest('.qty-minus, .cart-qty-minus')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            const button = e.target.closest('.qty-minus, .cart-qty-minus');
            const cartItemKey = button.dataset.cartItemKey;
            
            if (cartItemKey) {
                // Check current quantity
                const qtyDisplay = document.querySelector(`.qty-display[data-cart-item-key="${cartItemKey}"]`);
                const currentQty = parseInt(qtyDisplay?.textContent?.trim()) || 0;
                
                // Don't allow decrease if quantity is already 1
                if (currentQty <= 1) {
                    return false;
                }
                
                updateCartItemQuantity(cartItemKey, 'decrease');
            }
            return false;
        }
        
        // Handle remove item button
        if (e.target.closest('.btn-remove, .cart-remove-item')) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = e.target.closest('.btn-remove, .cart-remove-item');
            const cartItemKey = button.dataset.cartItemKey;
            
            if (cartItemKey && confirm('Are you sure you want to remove this item?')) {
                removeCartItem(cartItemKey);
            }
            return false;
        }
    }, true);

    /**
     * Show warning when stock limit reached
     */
    function showStockWarning(button, maxStock) {
        // Add visual feedback
        button.classList.add('disabled');
        button.disabled = true;
        
        // Show toast-like notification
        const message = `Stock limit: ${maxStock} item(s) available`;
        showStockWarningMessage(message);
        
        // Remove disabled state after 2 seconds
        setTimeout(() => {
            button.classList.remove('disabled');
            button.disabled = false;
        }, 2000);
    }

    /**
     * Show toast notification message
     */
    function showStockWarningMessage(message) {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.bs-cart-toast');
        existingToasts.forEach(t => t.remove());
        
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'bs-cart-toast alert alert-warning alert-dismissible fade show position-fixed bottom-0 end-0 m-3';
        toast.setAttribute('role', 'alert');
        toast.style.zIndex = '9999';
        toast.style.maxWidth = '300px';
        toast.innerHTML = `
            <small>${message}</small>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        // Remove after 4 seconds
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    /**
     * Show skeleton loader overlay on cart block
     */
    function showCartSkeleton() {
        const cartBlock = document.querySelector('[data-cart-block="true"]');
        if (!cartBlock) return;

        // Add skeleton overlay
        const skeleton = document.createElement('div');
        skeleton.className = 'bs-cart-skeleton';
        skeleton.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        skeleton.innerHTML = `
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `;

        // Make cart block relative for absolute positioning
        if (getComputedStyle(cartBlock).position === 'static') {
            cartBlock.style.position = 'relative';
        }

        cartBlock.appendChild(skeleton);
    }

    /**
     * Hide skeleton loader overlay
     */
    function hideCartSkeleton() {
        const skeleton = document.querySelector('.bs-cart-skeleton');
        if (skeleton) {
            skeleton.remove();
        }
    }

    /**
     * Update cart count badge in header
     */
    function updateCartCount() {
        if (typeof jQuery === 'undefined') {
            return;
        }

        const ajaxUrl = getAjaxUrl();

        jQuery.ajax({
            type: 'POST',
            url: ajaxUrl,
            data: {
                action: 'woocommerce_get_cart_count'
            },
            success: function(response) {
                if (response.success && typeof response.data.count !== 'undefined') {
                    // Update all cart count badges
                    const cartCountBadges = document.querySelectorAll('.cart-count');
                    cartCountBadges.forEach(badge => {
                        const newCount = response.data.count;
                        badge.textContent = newCount;
                        
                        // Hide badge if cart is empty
                        if (newCount === 0) {
                            badge.style.display = 'none';
                        } else {
                            badge.style.display = '';
                        }
                    });
                }
            }
        });
    }

    /**
     * Get AJAX URL from multiple possible sources
     */
    function getAjaxUrl() {
        // Try multiple sources for AJAX URL
        if (typeof bootstrapThemeCart !== 'undefined' && bootstrapThemeCart.ajaxUrl) {
            return bootstrapThemeCart.ajaxUrl;
        }
        if (typeof wc_add_to_cart_params !== 'undefined' && wc_add_to_cart_params.ajax_url) {
            return wc_add_to_cart_params.ajax_url;
        }
        if (typeof woocommerce_params !== 'undefined' && woocommerce_params.ajax_url) {
            return woocommerce_params.ajax_url;
        }
        if (typeof ajaxurl !== 'undefined') {
            return ajaxurl;
        }
        return '/wp-admin/admin-ajax.php';
    }

    /**
     * Update cart item quantity via AJAX
     */
    function updateCartItemQuantity(cartItemKey, action) {
        if (typeof jQuery === 'undefined') {
            return;
        }

        const quantity = action === 'increase' ? 1 : -1;
        const ajaxUrl = getAjaxUrl();
        
        // Get current quantity display element
        const qtyDisplay = document.querySelector(`.qty-display[data-cart-item-key="${cartItemKey}"]`);
        const currentQty = parseInt(qtyDisplay?.textContent?.trim()) || 0;
        const newQty = currentQty + quantity;
        
        // Don't allow quantity to go below 1 - use remove button instead
        if (newQty < 1) {
            return;
        }
        
        // Update display immediately for better UX
        if (qtyDisplay) {
            qtyDisplay.textContent = newQty;
        }

        jQuery.ajax({
            type: 'POST',
            url: ajaxUrl,
            data: {
                action: 'bs_cart_update_quantity',
                cart_item_key: cartItemKey,
                quantity: quantity
            },
            success: function(response) {
                if (response.success) {
                    if (isCheckout) {
                        // In checkout: trigger WooCommerce update without reload
                        jQuery(document.body).trigger('updated_wc_div');
                        jQuery(document.body).trigger('wc_update_cart');
                        handleCartUpdate();
                    } else {
                        // Outside checkout: reload cart block content via AJAX
                        showCartSkeleton();
                        const currentUrl = window.location.href;
                        jQuery('[data-cart-block="true"]').load(currentUrl + ' [data-cart-block="true"] > *', function() {
                            hideCartSkeleton();
                        });
                    }
                    
                    // Update cart count badge in header
                    updateCartCount();
                } else {
                    // Show error message if stock limit reached
                    showStockWarningMessage(response.data || 'Cannot update quantity');
                    // Revert the display back to original value on error
                    if (qtyDisplay) {
                        qtyDisplay.textContent = currentQty;
                    }
                }
            },
            error: function(xhr) {
                console.error('AJAX Error:', xhr);
                showStockWarningMessage('Error updating cart');
                // Revert the display back to original value on error
                if (qtyDisplay) {
                    qtyDisplay.textContent = currentQty;
                }
            }
        });
    }

    /**
     * Remove item from cart via AJAX
     */
    function removeCartItem(cartItemKey) {
        if (typeof jQuery === 'undefined') {
            return;
        }

        // Find the list item to remove
        const listItem = document.querySelector(`.list-group-item:has([data-cart-item-key="${cartItemKey}"])`);
        if (!listItem) {
            // Fallback: try alternative selector
            const removeButton = document.querySelector(`[data-cart-item-key="${cartItemKey}"]`);
            if (removeButton) {
                listItem = removeButton.closest('.list-group-item');
            }
        }

        // Add loading state to the item
        if (listItem) {
            listItem.style.opacity = '0.5';
            listItem.style.pointerEvents = 'none';
            
            // Add spinner overlay to the item
            const itemSkeleton = document.createElement('div');
            itemSkeleton.className = 'bs-cart-item-removing';
            itemSkeleton.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 5;
            `;
            itemSkeleton.innerHTML = `
                <div class="spinner-border spinner-border-sm text-danger" role="status">
                    <span class="visually-hidden">Removing...</span>
                </div>
            `;
            
            if (getComputedStyle(listItem).position === 'static') {
                listItem.style.position = 'relative';
            }
            listItem.appendChild(itemSkeleton);
        }

        const ajaxUrl = getAjaxUrl();

        jQuery.ajax({
            type: 'POST',
            url: ajaxUrl,
            data: {
                action: 'bs_cart_remove_item',
                cart_item_key: cartItemKey
            },
            success: function(response) {
                if (response.success) {
                    // Remove the item visually with fade out
                    if (listItem) {
                        jQuery(listItem).fadeOut(300, function() {
                            jQuery(this).remove();
                            
                            // Check if cart is empty
                            const remainingItems = document.querySelectorAll('[data-cart-block="true"] .list-group-item');
                            if (remainingItems.length === 0) {
                                // Reload to show empty cart message
                                if (isCheckout) {
                                    jQuery(document.body).trigger('updated_wc_div');
                                    jQuery(document.body).trigger('wc_update_cart');
                                    handleCartUpdate();
                                } else {
                                    showCartSkeleton();
                                    const currentUrl = window.location.href;
                                    jQuery('[data-cart-block="true"]').load(currentUrl + ' [data-cart-block="true"] > *', function() {
                                        hideCartSkeleton();
                                    });
                                }
                            }
                        });
                    }
                    
                    if (isCheckout) {
                        // In checkout: trigger WooCommerce update to refresh totals
                        jQuery(document.body).trigger('updated_wc_div');
                        jQuery(document.body).trigger('wc_update_cart');
                        handleCartUpdate();
                    } else {
                        // Outside checkout: reload cart block to update totals
                        showCartSkeleton();
                        const currentUrl = window.location.href;
                        jQuery('[data-cart-block="true"]').load(currentUrl + ' [data-cart-block="true"] > *', function() {
                            hideCartSkeleton();
                        });
                    }
                    
                    // Update cart count badge in header
                    updateCartCount();
                } else if (response.data) {
                    // Remove skeleton and restore item on error
                    if (listItem) {
                        const skeleton = listItem.querySelector('.bs-cart-item-removing');
                        if (skeleton) skeleton.remove();
                        listItem.style.opacity = '1';
                        listItem.style.pointerEvents = 'auto';
                    }
                    showStockWarningMessage(response.data);
                }
            },
            error: function(xhr) {
                console.error('AJAX Error:', xhr);
                // Remove skeleton and restore item on error
                if (listItem) {
                    const skeleton = listItem.querySelector('.bs-cart-item-removing');
                    if (skeleton) skeleton.remove();
                    listItem.style.opacity = '1';
                    listItem.style.pointerEvents = 'auto';
                }
                showStockWarningMessage('Error removing item');
            }
        });
    }

});

