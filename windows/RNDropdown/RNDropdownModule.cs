using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Dropdown.RNDropdown
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNDropdownModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNDropdownModule"/>.
        /// </summary>
        internal RNDropdownModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNDropdown";
            }
        }
    }
}
